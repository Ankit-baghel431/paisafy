from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import random

app = FastAPI(title="Paisafy AI Service")

class CategorizationRequest(BaseModel):
    description: str

class AdviceRequest(BaseModel):
    user_id: int
    context: str

@app.get("/")
def health_check():
    return {"status": "ok", "service": "Paisafy AI"}

@app.post("/predict-category")
def predict_category(request: CategorizationRequest):
    # Mock ML Model logic
    categories = ["Food", "Travel", "Utilities", "Shopping", "Health"]
    predicted = random.choice(categories)
    # Simple rule-based for demo
    desc = request.description.lower()
    if "uber" in desc or "fuel" in desc:
        predicted = "Travel"
    elif "grocery" in desc or "burger" in desc:
        predicted = "Food"
    
    return {"category": predicted, "confidence": 0.85}

@app.post("/financial-advice")
def get_financial_advice(request: AdviceRequest):
    # Mock AI Advisor
    advices = [
        "Try to save 20% of your income this month.",
        "Your food expenses are higher than usual.",
        "Consider investing in a low-risk index fund."
    ]
    return {"advice": random.choice(advices)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
