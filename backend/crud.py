# For all the database CRUD operations
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException
from models import UserCreate, FoodItemCreate, RequestCreate
from schema import User, FoodItem, Request

def create_user(db: Session, user_data: UserCreate, hashed_password: str):
    """Create a new user with auth info"""

    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hashed_password,
        location=user_data.location,
        type=user_data.type,
        contact_info=user_data.contact_info,
        role=user_data.role,
    )
    db.add(user)
    db.flush()  # Get auth_id
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str):
    """Get auth entry by email"""
    return db.query(User).filter(User.email == email).first()


def create_new_food_item(db: Session, food_item_data: FoodItemCreate, user_id: int):
    """Create a new food item"""
    food_item = FoodItem(
        provider_id=user_id,
        **food_item_data.dict()
    )
    db.add(food_item)
    db.commit()
    db.refresh(food_item)
    return food_item

def get_available_food_items(db: Session, time: datetime, preferences: str):
    """Get available food items based on time and preferences"""
    query = db.query(FoodItem).filter(
        FoodItem.status == "available",
        FoodItem.expiry > time,
        FoodItem.available_from <= time,
        FoodItem.available_until >= time
    )

    # Optional: filter based on preferences
    if preferences:
        # Basic example: filter by preferred cuisine type in description
        preferred_keywords = preferences.get("cuisine")
        if preferred_keywords:
            query = query.filter(FoodItem.description.ilike(f"%{preferred_keywords}%"))

    query.order_by(FoodItem.expiry.asc()).all()
    return query


def create_request(db: Session, receiver_id: int, request_data: RequestCreate):
    new_request = Request(
        receiver_id=receiver_id,
        title=request_data.title,
        requested_item=request_data.requested_item,
        category=request_data.category,
        quantity=request_data.quantity,
        urgency=request_data.urgency,
        needed_by=request_data.needed_by,
        is_recurring=request_data.is_recurring,
        notes=request_data.notes,
        status="open"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request
