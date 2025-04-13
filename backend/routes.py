#ALl the endpoints will be defined here

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config.logging_config import get_logger

app_router = APIRouter()
logger = get_logger(__name__)