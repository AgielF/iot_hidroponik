from fastapi import FastAPI
from routes.analysis import router as analysis_router

app = FastAPI()

# Menyertakan router untuk endpoint analisis
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI IoT Data Analysis Project"}
