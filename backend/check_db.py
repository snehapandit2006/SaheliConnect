from database import SessionLocal
from models import NGO
import auth

db = SessionLocal()
ngos = db.query(NGO).all()
print(f"Total NGOs: {len(ngos)}")
for n in ngos:
    print(n.name, n.email)
    
if ngos:
    pwd_match = auth.verify_password("password123", ngos[0].hashed_password)
    print(f"Password match for {ngos[0].email} with 'password123': {pwd_match}")

db.close()
