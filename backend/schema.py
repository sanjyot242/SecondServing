from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, CheckConstraint, Boolean
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from config.database import Base 

# Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    contact_info = Column(String(20))
    role = Column(String(20), nullable=False)  # 'provider' or 'receiver'
    location = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # restaurant/store/person/NGO
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('provider', 'receiver')", name="check_user_role"),
    )

    food_items = relationship("FoodItem", back_populates="provider")
    food_requests = relationship("Request", back_populates="receiver")

# Food_Items Table
class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True)
    provider_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(String(50))  # e.g. grains, dairy, cooked, canned
    quantity = Column(Integer, nullable=False)
    expiry = Column(DateTime, nullable=False)
    available_from = Column(DateTime)
    available_until = Column(DateTime)
    pickup_location = Column(Text)
    status = Column(String(20), default="available")  # available, matched, picked_up
    created_at = Column(DateTime, server_default=func.now())

    provider = relationship("User", back_populates="food_items")
    matched_request = relationship("Request", back_populates="matched_item", uselist=False)


class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    requested_item = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    urgency = Column(String(20), nullable=False)  # low, medium, high
    needed_by = Column(DateTime, nullable=True)   # optional
    is_recurring = Column(Boolean, default=False)
    notes = Column(Text)
    matched_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=True)
    status = Column(String(20), default="open")  # open, matched, fulfilled, cancelled
    created_at = Column(DateTime, server_default=func.now())

    receiver = relationship("User", back_populates="food_requests")
    matched_item = relationship("FoodItem", back_populates="matched_request")

    feedback = relationship("Feedback", back_populates="request", uselist=False)



# Feedback Table
class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comments = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    request = relationship("Request", back_populates="feedback")