#For type verification using pydantic

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    location: str
    type: Optional[str]
    contactInfo: str
    password: str
    email: str
    role: str

class Token(BaseModel):
    user_id: int


class TokenData(BaseModel):
    email: str