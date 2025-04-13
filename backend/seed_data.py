from config.database import SessionLocal
from auth import get_password_hash
from crud import create_user, create_new_food_item, create_request
from datetime import datetime, timedelta


from models import UserCreate
from models import FoodItemCreate, RequestCreate

# ----------------- USERS ------------------
provider_user = {
    "name": "GroceryMart",
    "location": "123 Market St",
    "type": "store",
    "contact_info": "111-222-3333",
    "password": "providerpass",
    "email": "provider@example.com",
    "role": "provider"
}

receiver_user = {
    "name": "Shelter A",
    "location": "456 Community Dr",
    "type": "NGO",
    "contact_info": "999-888-7777",
    "password": "receiverpass",
    "email": "receiver@example.com",
    "role": "receiver"
}

provider_model = UserCreate(**provider_user)
receiver_model = UserCreate(**receiver_user)


# ----------------- FOOD ITEMS ------------------
food_items = [
    {
        "title": "Banana Box",
        "description": "Fresh ripe bananas",
        "category": "Produce",
        "quantity": 10,
        "expiry": datetime.utcnow() + timedelta(days=1),
        "available_from": datetime.utcnow() - timedelta(hours=1),
        "available_until": datetime.utcnow() + timedelta(hours=5),
        "pickup_location": "123 Market St"
    },
    {
        "title": "Milk Carton",
        "description": "Organic milk, 1L",
        "category": "Dairy",
        "quantity": 5,
        "expiry": datetime.utcnow() + timedelta(days=3),
        "available_from": datetime.utcnow() - timedelta(hours=1),
        "available_until": datetime.utcnow() + timedelta(hours=6),
        "pickup_location": "123 Market St"
    }
]

# ----------------- REQUESTS ------------------
requests = [
    {
        "title": "Need bananas for breakfast",
        "requested_item": "Banana",
        "category": "Produce",
        "quantity": 5,
        "urgency": "high",
        "needed_by": datetime.utcnow() + timedelta(hours=10),
        "is_recurring": False,
        "notes": "Need by tomorrow morning"
    },
    {
        "title": "Need milk for children",
        "requested_item": "Milk",
        "category": "Dairy",
        "quantity": 2,
        "urgency": "medium",
        "needed_by": datetime.utcnow() + timedelta(days=2),
        "is_recurring": False,
        "notes": "Non-fat preferred"
    }
]


# ----------------- SEED ------------------
db = SessionLocal()

provider = create_user(db, provider_model, get_password_hash(provider_user["password"]))
receiver = create_user(db, receiver_model, get_password_hash(receiver_user["password"]))

for item in food_items:
    create_new_food_item(db, FoodItemCreate(**item), provider.id)

for req in requests:
    create_request(db, receiver.id, RequestCreate(**req))

print(" Database seeded with provider, receiver, food items, and requests.")