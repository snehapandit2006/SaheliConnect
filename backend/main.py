from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordRequestForm

import models, schemas, database, nlp, auth
from seed import seed_db

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

models.Base.metadata.create_all(bind=database.engine)

# Auto-seed check on startup
db = database.SessionLocal()
if db.query(models.NGO).count() == 0:
    print("No database records found. Running auto-seed...")
    seed_db()
db.close()

app = FastAPI(title="Social Support Coordination API")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    print(f"DEBUG LOGIN - Username: '{form_data.username}', Password: '{form_data.password}'")
    ngo = db.query(models.NGO).filter(models.NGO.email == form_data.username).first()
    if not ngo:
        print("DEBUG LOGIN - NGO not found")
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not auth.verify_password(form_data.password, ngo.hashed_password):
        print("DEBUG LOGIN - Password verification failed")
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    print("DEBUG LOGIN - Success!")
    access_token = auth.create_access_token(data={"sub": ngo.email})
    return {"access_token": access_token, "token_type": "bearer", "ngo_name": ngo.name, "ngo_id": ngo.id}

@app.get("/api/ngos", response_model=List[schemas.NGO])
def read_ngos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ngos = db.query(models.NGO).offset(skip).limit(limit).all()
    return ngos

@app.get("/api/cases", response_model=List[schemas.Case])
def read_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    # Data Isolation: Only return cases strictly assigned to this NGO's ID
    cases = db.query(models.Case).filter(models.Case.ngo_id == current_ngo.id).order_by(models.Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases

@app.get("/api/cases/{case_id}", response_model=schemas.Case)
def read_case(case_id: int, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.patch("/api/cases/{case_id}", response_model=schemas.Case)
def update_case(case_id: int, case_update: schemas.CaseUpdate, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    db_case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if case_update.status:
        db_case.status = case_update.status
    if case_update.ngo_id:
        db_case.ngo_id = case_update.ngo_id
    if case_update.field_worker_id is not None:
        db_case.field_worker_id = case_update.field_worker_id
    if case_update.notes is not None:
        db_case.notes = case_update.notes
        
    db.commit()
    db.refresh(db_case)
    return db_case

@app.get("/api/ngos/{ngo_id}/workers", response_model=List[schemas.FieldWorker])
def read_workers(ngo_id: int, db: Session = Depends(get_db)):
    workers = db.query(models.FieldWorker).filter(models.FieldWorker.ngo_id == ngo_id).all()
    return workers

@app.post("/api/workers", response_model=schemas.FieldWorker)
def create_worker(worker: schemas.FieldWorkerCreate, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    # Security: force the worker to belong to the logged-in NGO
    db_worker = models.FieldWorker(**worker.model_dump(exclude={'ngo_id'}), ngo_id=current_ngo.id)
    db.add(db_worker)
    db.commit()
    db.refresh(db_worker)
    return db_worker

@app.delete("/api/workers/{worker_id}")
def delete_worker(worker_id: int, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    worker = db.query(models.FieldWorker).filter(models.FieldWorker.id == worker_id, models.FieldWorker.ngo_id == current_ngo.id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found or unauthorized")
    
    # Optional: Unassign cases mapped to this worker before deleting
    db.query(models.Case).filter(models.Case.field_worker_id == worker.id).update({models.Case.field_worker_id: None})
    
    db.delete(worker)
    db.commit()
    return {"message": "Field worker removed successfully"}

class NGOProfileUpdate(schemas.BaseModel):
    contact_info: Optional[str] = None
    capacity: Optional[int] = None
    services_offered: Optional[str] = None

@app.patch("/api/ngos/profile", response_model=schemas.NGO)
def update_ngo_profile(update_data: NGOProfileUpdate, db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    if update_data.contact_info is not None:
        current_ngo.contact_info = update_data.contact_info
    if update_data.capacity is not None:
        current_ngo.capacity = update_data.capacity
    if update_data.services_offered is not None:
        current_ngo.services_offered = update_data.services_offered
        
    db.commit()
    db.refresh(current_ngo)
    return current_ngo

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db), current_ngo: models.NGO = Depends(auth.get_current_ngo)):
    total_cases = db.query(models.Case).count()
    resolved_cases = db.query(models.Case).filter(models.Case.status == models.StatusEnum.RESOLVED).count()
    in_progress = db.query(models.Case).filter(models.Case.status == models.StatusEnum.IN_PROGRESS).count()
    urgent_cases = db.query(models.Case).filter(models.Case.priority == models.PriorityEnum.URGENT).count()
    
    return {
        "total": total_cases,
        "resolved": resolved_cases,
        "in_progress": in_progress,
        "urgent": urgent_cases
    }

from sqlalchemy import func
from datetime import datetime, timedelta

@app.get("/api/analytics/time-series")
def get_time_series(db: Session = Depends(get_db)):
    # Calculate trends over the last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    # Query cases per day
    daily_cases = db.query(
        func.date(models.Case.created_at).label("date"),
        func.count(models.Case.id).label("count")
    ).filter(models.Case.created_at >= seven_days_ago)\
     .group_by(func.date(models.Case.created_at))\
     .order_by(func.date(models.Case.created_at)).all()
     
    # Query resolutions per day
    daily_resolved = db.query(
        func.date(models.Case.created_at).label("date"),
        func.count(models.Case.id).label("count")
    ).filter(models.Case.created_at >= seven_days_ago, models.Case.status == models.StatusEnum.RESOLVED)\
     .group_by(func.date(models.Case.created_at))\
     .order_by(func.date(models.Case.created_at)).all()
    
    # Format into structured JSON
    trends = []
    cases_dict = {str(d.date): d.count for d in daily_cases}
    resolved_dict = {str(d.date): d.count for d in daily_resolved}
    
    for i in range(7):
        day = (seven_days_ago + timedelta(days=i)).date()
        date_str = str(day)
        trends.append({
            "date": date_str,
            "reported": cases_dict.get(date_str, 0),
            "resolved": resolved_dict.get(date_str, 0)
        })
        
    return {"trends": trends}

@app.post("/api/webhook/whatsapp", response_model=schemas.Case)
def whatsapp_webhook(payload: schemas.WebhookPayload, db: Session = Depends(get_db)):
    # 1. Get or create user
    user = db.query(models.User).filter(models.User.phone_number == payload.phone_number).first()
    if not user:
        user = models.User(phone_number=payload.phone_number)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Extract intent via NLP
    intent = nlp.classify_intent(payload.message)
    category = intent["category"]
    priority = intent["priority"]
    detected_language = intent.get("language", "en")
    
    # Update user language preference if different
    if user.preferred_language != detected_language:
        user.preferred_language = detected_language
        db.commit()

    # 3. Smart Routing Logic: Find best NGO (by Need + Location)
    assigned_ngo = None
    if category != "general":
        ngos = db.query(models.NGO).all()
        for ngo in ngos:
            if category in ngo.services_offered:
                # If location provided, try to match it
                if payload.location and payload.location.lower() in ngo.location.lower():
                    assigned_ngo = ngo
                    break
                elif not assigned_ngo:
                    assigned_ngo = ngo # Fallback if no location matched but category matched

    # Optional: ultimate fallback
    if not assigned_ngo:
        assigned_ngo = db.query(models.NGO).first()

    # 4. Create case
    new_case = models.Case(
        user_id=user.id,
        ngo_id=assigned_ngo.id if assigned_ngo else None,
        description=payload.message,
        priority=models.PriorityEnum(priority),
        status=models.StatusEnum.REPORTED,
        category=category,
        location=payload.location
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    
    return new_case

@app.post("/api/cases", response_model=schemas.Case)
@limiter.limit("5/minute")
def create_case_web(request: Request, payload: schemas.WebhookPayload, db: Session = Depends(get_db)):
    return whatsapp_webhook(payload, db)

from fastapi import Form, Response, Request

@app.post("/api/webhook/twilio")
@limiter.limit("10/minute")
async def twilio_webhook(
    request: Request,
    From: str = Form(...),
    Body: str = Form(...),
    Latitude: str = Form(None),
    Longitude: str = Form(None),
    db: Session = Depends(get_db)
):
    # Strip whatsapp: prefix if present
    phone_number = From.replace("whatsapp:", "")
    
    # Optional loc string mapping
    loc_str = None
    if Latitude and Longitude:
        loc_str = f"{Latitude}, {Longitude}"
        
    payload = schemas.WebhookPayload(
        phone_number=phone_number,
        message=Body,
        location=loc_str
    )
    
    # Re-use our existing logic
    whatsapp_webhook(payload, db)
    
    # Twilio expects raw XML response to acknowledge receipt
    return Response(content="<Response></Response>", media_type="application/xml")
