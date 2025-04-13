from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from config.logging_config import get_logger

app_router = APIRouter()
logger = get_logger(__name__)