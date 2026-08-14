from fastapi import FastAPI

app = FastAPI(title="EduSuccess ML Service")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "EduSuccess ML Service"}
