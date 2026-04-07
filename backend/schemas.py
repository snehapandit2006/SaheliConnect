from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
import re
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

class NGOSignup(BaseModel):
    name: str = Field(..., min_length=3)
    email: str
    password: str = Field(..., min_length=6)
    location: str = Field(..., min_length=3)
    contact_info: str

    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not re.match(pattern, v):
            raise ValueError('Invalid email format')
        return v

    @field_validator('contact_info')
    @classmethod
    def validate_phone(cls, v):
        pattern = r"^\+?[\d\s-]{10,15}$"
        if not re.match(pattern, v):
            raise ValueError('Invalid phone number format. Must contain 10-15 digits.')
        return v

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not any(c.isalpha() for c in v):
            raise ValueError('NGO Name must contain at least one letter')
        return v

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
