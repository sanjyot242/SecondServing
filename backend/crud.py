# For all the database CRUD operations
from sqlalchemy.orm import Session
from sqlalchemy import select
from models import UserCreate
from schema import User

def create_user(db: Session, user_data: UserCreate, hashed_password: str):
    """Create a new user with auth info"""

    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password,
        location=user_data.location,
        type=user_data.type,
        contact_info=user_data.contactInfo,
        role=user_data.role,
    )
    db.add(user)
    db.flush()  # Get auth_id

    # Then create user with auth_id
    db_user = User(
        auth_id=user.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    """Get auth entry by email"""
    return db.query(User).filter(User.email == email).first()