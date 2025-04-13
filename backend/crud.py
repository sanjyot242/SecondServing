# For all the database CRUD operations
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import select, or_, case
from fastapi import HTTPException
from models import UserCreate, FoodItemCreate, RequestCreate, FeedbackCreate
from schema import User, FoodItem, Request, Feedback
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

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

    if preferences:
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


def match_requests_to_food_items(db: Session):
    matches = []

    urgency_order = case(
        (Request.urgency == "high", 1),
        (Request.urgency == "medium", 2),
        (Request.urgency == "low", 3),
        else_=4
    )

    open_requests = db.query(Request)\
        .filter(Request.status == "open")\
        .order_by(urgency_order)\
        .all()

    for req in open_requests:
        query = db.query(FoodItem).filter(
            FoodItem.status == "available",
            FoodItem.category == req.category,
            FoodItem.quantity >= req.quantity,
            or_(
                FoodItem.title.ilike(f"%{req.requested_item}%"),
                FoodItem.description.ilike(f"%{req.requested_item}%")
            )
        )

        # if req.needed_by:
        #     query = query.filter(FoodItem.expiry >= req.needed_by)

        match = query.first()

        if match:
            # Update both sides
            req.status = "matched"
            req.matched_item_id = match.id
            match.status = "matched"

            db.add_all([req, match])
            matches.append({
                "request_id": req.id,
                "matched_food_id": match.id,
                "requested_item": req.requested_item,
                "matched_food_title": match.title,
                "urgency": req.urgency
            })

    db.commit()
    return matches


def mark_expired_food_items_as_fulfilled(db: Session):
    now = datetime.utcnow()

    expired_items = db.query(FoodItem).filter(
        FoodItem.status.in_(["matched", "available"]),
        FoodItem.expiry < now
    ).all()

    updated_ids = []
    for item in expired_items:
        item.status = "fulfilled"
        updated_ids.append(item.id)

    db.commit()
    return updated_ids


def mark_food_as_fulfilled(food_id: int, db: Session):
    food = db.query(FoodItem).filter(FoodItem.id == food_id).first()

    if not food:
        return {"error": "Food item not found."}

    if food.status != "matched":
        return {"error": "Only matched items can be marked as fulfilled."}

    food.status = "fulfilled"

    request = db.query(Request).filter(Request.matched_item_id == food.id).first()
    if request:
        request.status = "fulfilled"
        db.add(request)

    db.add(food)
    db.commit()

    return {"message": "Food and request marked as fulfilled."}


def get_active_inventory(db: Session, provider_id: int):
    now = datetime.utcnow()
    soon = now + timedelta(hours=48)

    items = db.query(FoodItem).filter(
        FoodItem.provider_id == provider_id,
        FoodItem.status.in_(["available", "matched"])
    ).all()

    result = []
    for item in items:
        condition = []

        if item.expiry < now:
            condition.append("expired")
        elif item.expiry <= soon:
            condition.append("expiring_soon")
        else:
            condition.append("fresh")

        if item.quantity < 3:
            condition.append("low_quantity")

        result.append({
            "id": item.id,
            "title": item.title,
            "category": item.category,
            "condition": ", ".join(condition),
            "available_until": item.available_until
        })

    return result

def submit_feedback(db: Session, receiver_id: int, feedback_data: FeedbackCreate):
    request = db.query(Request).filter(Request.id == feedback_data.request_id).first()

    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    if request.receiver_id != receiver_id:
        raise HTTPException(status_code=403, detail="You are not the owner of this request")

    if request.status != "fulfilled":
        raise HTTPException(status_code=400, detail="Feedback can only be submitted for fulfilled requests")

    if request.feedback:
        raise HTTPException(status_code=400, detail="Feedback already submitted for this request")

    new_feedback = Feedback(
        request_id=feedback_data.request_id,
        rating=feedback_data.rating,
        comments=feedback_data.comments
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback


def get_requests_for_receiver(db: Session, receiver_id: int):
    requests = db.query(Request).filter(Request.receiver_id == receiver_id).all()

    results = []
    for req in requests:
        results.append({
            "id": req.id,
            "title": req.title,
            "created_at": req.created_at,
            "urgency": req.urgency.capitalize(),
            "status": req.status.capitalize(),
            "notes": req.notes,
            "items": [{
                "name": req.requested_item,
                "category": req.category,
                "quantity": req.quantity,
                "unit": "units"
            }]
        })

    return results

def match_requests_to_food_items_ai(db: Session, similarity_threshold: float = 0.5):
    from schema import FoodItem, Request
    import torch

    matches = []

    open_requests = db.query(Request).filter(Request.status == "open").all()
    food_items = db.query(FoodItem).filter(FoodItem.status == "available").all()

    if not open_requests or not food_items:
        return matches

    food_texts = [f"{item.title} {item.description or ''}" for item in food_items]
    food_embeddings = model.encode(food_texts, convert_to_tensor=True)

    for req in open_requests:
        req_text = f"{req.requested_item} {req.notes or ''}"
        req_embedding = model.encode(req_text, convert_to_tensor=True)

        cosine_scores = util.cos_sim(req_embedding, food_embeddings)[0]

        best_idx = torch.argmax(cosine_scores).item()
        best_score = cosine_scores[best_idx].item()

        if best_score >= similarity_threshold:
            matched_food = food_items[best_idx]

            req.status = "matched"
            req.matched_item_id = matched_food.id
            matched_food.status = "matched"

            db.add_all([req, matched_food])
            matches.append({
                "request_id": req.id,
                "matched_food_id": matched_food.id,
                "similarity": round(best_score, 3),
                "requested_item": req.requested_item,
                "matched_food_title": matched_food.title,
            })

    db.commit()
    return matches