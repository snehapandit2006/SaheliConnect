from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from database import Base

class PriorityEnum(str, enum.Enum):
    URGENT = "urgent"
    MODERATE = "moderate"
    LOW = "low"

class StatusEnum(str, enum.Enum):
    REPORTED = "reported"
    IN_PROGRESS = "in-progress"
    RESOLVED = "resolved"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True) # Anonymized
    preferred_language = Column(String, default="en")
    cases = relationship("Case", back_populates="user")

class NGO(Base):
    __tablename__ = "ngos"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=True) # Added for login
    hashed_password = Column(String, nullable=True) # Added for login
    services_offered = Column(String) # Comma-separated keywords representing services (e.g., protection, skill_development)
    location = Column(String)
    contact_info = Column(String)
    capacity = Column(Integer, default=10)
    cases = relationship("Case", back_populates="ngo")
    workers = relationship("FieldWorker", back_populates="ngo")

class FieldWorker(Base):
    __tablename__ = "field_workers"
    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(Integer, ForeignKey("ngos.id"))
    name = Column(String)
    phone_number = Column(String)
    
    ngo = relationship("NGO", back_populates="workers")
    cases = relationship("Case", back_populates="field_worker")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ngo_id = Column(Integer, ForeignKey("ngos.id"), nullable=True)
    field_worker_id = Column(Integer, ForeignKey("field_workers.id"), nullable=True)
    description = Column(Text)
    priority = Column(SQLEnum(PriorityEnum), default=PriorityEnum.MODERATE)
    status = Column(SQLEnum(StatusEnum), default=StatusEnum.REPORTED)
    category = Column(String, default="general")
    location = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cases")
    ngo = relationship("NGO", back_populates="cases")
    field_worker = relationship("FieldWorker", back_populates="cases")
