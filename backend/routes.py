#ALl the endpoints will be defined here

from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from config.logging_config import get_logger
from config.database import get_db
from models import UserCreate, Token, FoodItemCreate, FoodItemOut, RequestOut, RequestCreate, FeedbackOut, FeedbackCreate, ShelterRequestOut
from schema import User
from crud import create_user, get_user_by_email, create_new_food_item, get_active_inventory, create_request, match_requests_to_food_items, mark_expired_food_items_as_fulfilled, mark_food_as_fulfilled, submit_feedback, get_requests_for_receiver
from auth import authenticate_user, create_access_token, get_current_user, set_auth_cookie, get_password_hash
from fastapi.responses import JSONResponse

app_router = APIRouter()
logger = get_logger(__name__)

################ AUTHENTICATION BACKCEND ENDPOINTS #######################



@app_router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login endpoint to get access token."""
    logger.info(f"Login attempt for email: {form_data.username}")
    user_info = authenticate_user(db, form_data.username, form_data.password)
    if not user_info:
        logger.warning(f"Failed login attempt for email: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user_info.email})
    logger.info(f"Successful login for user_id: {user_info.id}, email: {user_info.email}")
    
    response = JSONResponse(content={
        "user_id": user_info.id,
    })
    set_auth_cookie(response, access_token, user_info.role)
    
    return response

@app_router.post("/register", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    logger.info(f"Registration attempt for email: {user.email}")
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        logger.warning(f"Registration failed - email already exists: {user.email}")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    create_user(db, user, hashed_password)
    logger.info(f"User created successfully with email: {user.email}")
    
    auth_info = authenticate_user(db, user.email, user.password)
    if not auth_info:
        logger.error(f"Failed to authenticate newly created user: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": auth_info.email})
    logger.info(f"Registration complete for user_id: {auth_info.id}, email: {auth_info.email}")
    
    response = JSONResponse(content={
        "user_id": auth_info.id,
        "role": auth_info.role
    })
    set_auth_cookie(response, access_token, user.role)
    
    return response

@app_router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("access_token")
    return response

@app_router.get("/auth/me")
async def get_authenticated_user(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }



################## FOOD ITEM ENDPOINT #######################

@app_router.post("/add-food", response_model=FoodItemOut)
def create_food_item(
    food_data: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        if current_user.role != "provider":
            raise HTTPException(status_code=403, detail="Only providers can post food items")

        food_item = create_new_food_item(db, food_data, current_user.id)
        return food_item
    except HTTPException as http_exc:
        logger.error(f"HTTPException: {http_exc.detail}")
        raise http_exc
    except Exception as exc:
        logger.error(f"An unexpected error occurred: {exc}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    



############## REQUEST & MATCHING ENDPOINTS #######################
@app_router.post("/requests", response_model=RequestOut)
def submit_food_request(
    request_data: RequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "receiver":
        raise HTTPException(status_code=403, detail="Only receivers can submit requests")

    return create_request(db, current_user.id, request_data)




@app_router.post("/match")
def run_matching(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "provider":
        return {"message": "Only providers can trigger matching."}

    result = match_requests_to_food_items(db)
    return {
        "message": f"{len(result)} match(es) created.",
        "matches": result
    }




############### PROVIDER ENDPOINTS #######################
@app_router.patch("/mark-expired")
def auto_expire_food(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "provider":
        return {"message": "Only providers can update food status."}

    expired = mark_expired_food_items_as_fulfilled(db)
    return {
        "message": f"{len(expired)} expired item(s) marked as fulfilled.",
        "expired_food_ids": expired
    }


@app_router.patch("/food/{food_id}/fulfill")
def fulfill_food_item(
    food_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "provider":
        return {"message": "Only providers can fulfill food items."}

    result = mark_food_as_fulfilled(food_id, db)
    return result


@app_router.get("/inventory/active")
def load_active_inventory(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "provider":
        return {"message": "Only providers have an active inventory."}

    inventory = get_active_inventory(db, user.id)
    return {"inventory": inventory}


####################### FEEDBACK ENDPOINTS #######################
@app_router.post("/feedback", response_model=FeedbackOut)
def leave_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "receiver":
        raise HTTPException(status_code=403, detail="Only receivers can leave feedback")

    return submit_feedback(db, current_user.id, feedback_data)


@app_router.get("/receiver/requests", response_model=List[ShelterRequestOut])
def get_receiver_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "receiver":
        raise HTTPException(status_code=403, detail="Only receivers can view their requests")
    
    return get_requests_for_receiver(db, current_user.id)