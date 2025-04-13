from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from routes import app_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from your frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
app.include_router(app_router)

@app.get("/")
async def root():
    return {"message": "SecondServing Backend is running!"}