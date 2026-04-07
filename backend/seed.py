from database import SessionLocal, engine
import models, auth

# Drop all tables first to ensure clean state
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    if db.query(models.NGO).count() == 0:
        default_hash = auth.get_password_hash("password123")
        ngos = [
            models.NGO(name="Asha Protection Center", email="asha@ngo.org", hashed_password=default_hash, services_offered="protection,shelter", location="North District", contact_info="1234567890", capacity=20),
            models.NGO(name="MindCare Foundation", email="mindcare@ngo.org", hashed_password=default_hash, services_offered="mental_health,counseling", location="Central District", contact_info="0987654321", capacity=15),
            models.NGO(name="Udaan Skills Hub", email="udaan@ngo.org", hashed_password=default_hash, services_offered="skill_development,job,study", location="East District", contact_info="1122334455", capacity=50),
            models.NGO(name="Swasthya Medical Outreach", email="swasthya@ngo.org", hashed_password=default_hash, services_offered="health_hygiene,medical", location="South District", contact_info="6677889900", capacity=30)
        ]
        db.add_all(ngos)
        db.commit()
        
        # Add mock Field Workers for the NGOs
        db.refresh(ngos[0])
        db.refresh(ngos[1])
        db.refresh(ngos[2])
        db.refresh(ngos[3])
        
        workers = [
            models.FieldWorker(name="Ravi Kumar", phone_number="9876543210", ngo_id=ngos[0].id),
            models.FieldWorker(name="Anita Devi", phone_number="8765432109", ngo_id=ngos[0].id),
            models.FieldWorker(name="Vikram Singh", phone_number="7654321098", ngo_id=ngos[1].id),
            models.FieldWorker(name="Pooja Sharma", phone_number="6543210987", ngo_id=ngos[2].id),
        ]
        db.add_all(workers)
        db.commit()
        
        print("Database seeded with mock NGOs and Field Workers.")
    else:
        print("Database already seeded.")
        
    db.close()

if __name__ == "__main__":
    seed_db()
