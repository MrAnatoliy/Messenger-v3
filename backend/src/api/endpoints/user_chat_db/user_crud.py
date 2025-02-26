from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from sqlalchemy.orm import Session
from sqlalchemy import or_

from src.models.databases.chat_history import get_chat_history_db
from src.models.Chatroom import Chatroom
from src.schemes.UserResponse import Contact, UserResponse
from src.api.dependencies import get_current_active_user, get_user_chat_db_session
from src.models.User import User

router = APIRouter()

@router.get("/all")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_user_chat_db_session)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users


@router.get("/user_data", response_model = UserResponse)
async def get_user_data(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_user_chat_db_session),
    chat_history_db: AsyncIOMotorDatabase = Depends(get_chat_history_db)
):
    # Fetch the current user from the SQL database
    user_data = db.query(User).where(User.id == current_user.id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    response = UserResponse(
        id=str(user_data.id),
        username=user_data.username,
        email=user_data.email,
        contacts=[]
    )

    # Get all chatrooms where the current user is a participant, eagerly evaluating the query.
    users_chats = db.query(Chatroom).filter(
        or_(
            Chatroom.first_user_id == current_user.id,
            Chatroom.second_user_id == current_user.id
        )
    ).all()

    if users_chats:
        # Collect all chatroom IDs in a list
        chat_ids = [chat.id for chat in users_chats]

        # Query MongoDB in one request using the $in operator
        cursor = chat_history_db["messenger_chat_history"].find({"chatroom_id": {"$in": chat_ids}})
        chat_histories = await cursor.to_list(length=None)

        # Create a mapping of chatroom_id to its chat history document
        history_map = {doc["chatroom_id"]: doc for doc in chat_histories}

        # Iterate over each chatroom, find its corresponding chat history and add the contact
        for chat in users_chats:
            chat_history_doc = history_map.get(chat.id, {})
            messages = chat_history_doc.get("messages", [])

            # Determine the contact id: if current user is first user then contact is second, and vice versa.
            contact_id = chat.second_user_id if chat.first_user_id == user_data.id else chat.first_user_id
            contact_name = db.query(User).where(User.id == contact_id).first().username
            contact = Contact(
                contact_id=str(contact_id),
                contact_name=contact_name,
                messages=messages
            )
            response.contacts.append(contact.model_copy())

    return response