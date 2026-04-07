from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from models import PriorityEnum, StatusEnum

class UserBase(BaseModel):
    phone_number: str
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class NGOBase(BaseModel):
    name: str
    services_offered: str
    location: str
    contact_info: str
    capacity: int

class NGOCreate(NGOBase):
    pass

class NGO(NGOBase):
    id: int
    class Config:
        from_attributes = True

class FieldWorkerBase(BaseModel):
    name: str
    phone_number: str
    ngo_id: int

class FieldWorkerCreate(FieldWorkerBase):
    pass

class FieldWorker(FieldWorkerBase):
    id: int
    class Config:
        from_attributes = True

class CaseBase(BaseModel):
    description: str
    priority: PriorityEnum
    status: StatusEnum
    category: str
    location: Optional[str] = None
    notes: Optional[str] = None

class CaseCreate(CaseBase):
    user_id: int
    ngo_id: Optional[int] = None
    field_worker_id: Optional[int] = None

class CaseUpdate(BaseModel):
    status: Optional[StatusEnum] = None
    ngo_id: Optional[int] = None
    field_worker_id: Optional[int] = None
    notes: Optional[str] = None

class Case(CaseBase):
    id: int
    user_id: int
    ngo_id: Optional[int]
    field_worker_id: Optional[int]
    created_at: datetime
    
    ngo: Optional[NGO] = None
    field_worker: Optional[FieldWorker] = None
    user: Optional[User] = None
    
    class Config:
        from_attributes = True

class WebhookPayload(BaseModel):
    phone_number: str
    message: str
    location: Optional[str] = None
