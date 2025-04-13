from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, CheckConstraint
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

# Users Table
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    contact_info = Column(String(20))
    role = Column(String(20), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    location = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # e.g., 'provider', 'receiver'

    __table_args__ = (
        CheckConstraint("role IN ('provider', 'receiver')", name="check_user_role"),
    )

    provided_items = relationship("FoodItem", back_populates="provider", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="receiver", cascade="all, delete-orphan")


# Food_Items Table
class FoodItem(Base):
    __tablename__ = 'food_items'

    id = Column(Integer, primary_key=True)
    provider_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String(100), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False)
    expiry = Column(DateTime, nullable=False)
    available_from = Column(DateTime)
    available_until = Column(DateTime)
    pickup_location = Column(Text)
    status = Column(String(20), default='available')
    created_at = Column(DateTime, server_default=func.now())

    provider = relationship("User", back_populates="provided_items")
    reservations = relationship("Reservation", back_populates="food_item", cascade="all, delete-orphan")


# Reservations Table
class Reservation(Base):
    __tablename__ = 'reservations'

    id = Column(Integer, primary_key=True)
    food_item_id = Column(Integer, ForeignKey('food_items.id'))
    receiver_id = Column(Integer, ForeignKey('users.id'))
    reservation_time = Column(DateTime, server_default=func.now())
    status = Column(String(20), default='pending')
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    food_item = relationship("FoodItem", back_populates="reservations")
    receiver = relationship("User", back_populates="reservations")
    feedback = relationship("Feedback", back_populates="reservation", uselist=False, cascade="all, delete-orphan")


# Feedback Table
class Feedback(Base):
    __tablename__ = 'feedback'

    id = Column(Integer, primary_key=True)
    reservation_id = Column(Integer, ForeignKey('reservations.id'))
    rating = Column(Integer)
    comments = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint('rating BETWEEN 1 AND 5', name='check_rating_range'),
    )

    reservation = relationship("Reservation", back_populates="feedback")