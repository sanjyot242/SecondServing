from pydantic import BaseModel, Field, conint
from typing import Literal, Optional, Annotated
from datetime import datetime
from enum import Enum

# -------------------- Enums --------------------

class FoodCategory(str, Enum):
    produce = "Produce"
    dairy = "Dairy"
    meat = "Meat"
    baked_goods = "Baked Goods"
    canned_goods = "Canned Goods"
    dry_goods = "Dry Goods"
    beverages = "Beverages"
    frozen_foods = "Frozen Foods"
    prepared_foods = "Prepared Foods"
    others = "Others"              

# -------------------- User --------------------

class UserCreate(BaseModel):
    name: str
    location: str
    type: Optional[str] = None
    contact_info: str = Field(..., alias="contactInfo")
    password: str
    email: str
    role: str

    model_config = {
        "populate_by_name": True
    }

# -------------------- Auth --------------------

class Token(BaseModel):
    user_id: int

class TokenData(BaseModel):
    email: str

# -------------------- Food Item --------------------

class FoodItemCreate(BaseModel):
    title: str
    description: Optional[str]
    category: FoodCategory
    quantity: int
    expiry: datetime
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    pickup_location: str = Field(..., alias="pickupLocation")

    model_config = {
        "populate_by_name": True,
        "extra": "ignore"
    }

class FoodItemOut(FoodItemCreate):
    id: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }

# -------------------- Request --------------------

class RequestCreate(BaseModel):
    title: str
    requested_item: str
    category: FoodCategory
    quantity: int
    urgency: Literal["low", "medium", "high"]
    needed_by: Optional[datetime] = None
    is_recurring: Optional[bool] = False
    notes: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }

class RequestOut(RequestCreate):
    id: int
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }

#--------------------- Feedback ---------------------
class FeedbackCreate(BaseModel):
    request_id: int
    rating: Annotated[int, conint(ge=1, le=5)]  # 1 to 5
    comments: Optional[str] = None

class FeedbackOut(FeedbackCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True