def classify_intent(message: str) -> dict:
    msg_lower = message.lower()
    
    # Priority classification
    urgent_keywords = ["danger", "help", "attack", "safe", "threat", "emergency", "bachao", "mar", "police", "sos", "bacha", "dar"]
    priority = "moderate"
    if any(word in msg_lower for word in urgent_keywords):
        priority = "urgent"
    elif any(word in msg_lower for word in ["job", "skill", "learn", "kaam", "study", "work", "rozgar"]):
        priority = "low"
        
    # Category matched with NGO services
    category = "general"
    if any(word in msg_lower for word in ["job", "skill", "learn", "kaam", "study", "work", "money", "rozgar"]):
        category = "skill_development"
    elif any(word in msg_lower for word in ["danger", "safe", "attack", "help", "police", "bachao", "threat", "dar"]):
        category = "protection"
    elif any(word in msg_lower for word in ["depressed", "sad", "mental", "tension", "stress", "lonely", "problem"]):
        category = "mental_health"
    elif any(word in msg_lower for word in ["pad", "hygiene", "sick", "health", "water", "hospital", "doctor"]):
        category = "health_hygiene"
        
    # Language Detection (Basic Romanized Hindi Keywords)
    hindi_keywords = ["bachao", "mar", "bacha", "dar", "kaam", "rozgar", "chahiye", "hai", "karo", "nahi", "mujhe", "madad"]
    detected_lang = "en"
    if any(word in msg_lower for word in hindi_keywords):
        detected_lang = "hi_roman"

    return {
        "priority": priority,
        "category": category,
        "language": detected_lang
    }
