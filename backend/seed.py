from database import SessionLocal, engine
import models, auth

# Drop all tables first to ensure clean state
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    
    # We always reset to exactly one NGO for testing as requested
    default_hash = auth.get_password_hash("password123")
    
    test_ngo = models.NGO(
        name="Test NGO Center", 
        email="test@ngo.org", 
        hashed_password=default_hash, 
        services_offered="protection,shelter,mental_health", 
        location="Universal District", 
        contact_info="9999999999", 
        capacity=50
    )
    
    db.add(test_ngo)
    db.commit()
    db.refresh(test_ngo)
    
    # Add mock Field Workers for the single test NGO
    workers = [
        models.FieldWorker(name="Rahul Jha", phone_number="9800000001", ngo_id=test_ngo.id),
        models.FieldWorker(name="Sita Gupta", phone_number="9800000002", ngo_id=test_ngo.id),
    ]
    
    db.add_all(workers)
    db.commit()
    
    print("Database RESET: 1 NGO and 2 Field Workers created.")
    print("Credentials -> Email: test@ngo.org | Password: password123")
        
    db.close()

if __name__ == "__main__":
    seed_db()
