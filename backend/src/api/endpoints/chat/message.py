from datetime import datetime, timezone
import json
from fastapi import APIRouter, Depends, HTTPException, WebSocket, status, WebSocketDisconnect
from sqlalchemy.orm import Session
from motor.motor_asyncio import AsyncIOMotorDatabase

from src.models.databases.chat_history import get_chat_history_db
from src.models.Chatroom import Chatroom
from src.schemes.User import User
from src.api.dependencies import (
    get_current_active_user,
    get_user_chat_db_session,
    get_current_user_ws
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f'active users : {self.active_connections}')
        await self.broadcast_active_users()

    async def disconnection(self, user_id: int):
        self.active_connections.pop(user_id, None)
        print(f'remaint active users : {self.active_connections}')
        await self.broadcast_active_users()

    async def send_message(self, user_id: int, message: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast_active_users(self):
        # Notify all connected clients with the updated list of active users
        active_user_ids = list(self.active_connections.keys())
        for websocket in self.active_connections.values():
            print(f'broadcasting active users to : {websocket}')
            await websocket.send_text(json.dumps({
                "type": "active_users_update",
                "active_users": active_user_ids
            }))

connectionManager = ConnectionManager()
router = APIRouter()

@router.websocket("/ws")
async def websocker_endpoint(
    websocket: WebSocket, 
    current_user: User = Depends(get_current_user_ws),
    user_chat_db: Session = Depends(get_user_chat_db_session),
    chat_history_db: AsyncIOMotorDatabase = Depends(get_chat_history_db)
):
    # Connect using the user's ID (ensure it's an int)
    await connectionManager.connect(int(current_user.id), websocket)
    try:
        while True:
            received_data = await websocket.receive_text()
            data = json.loads(received_data)

            recipient_id = data.get("recipient_id")
            message_text = data.get("message")

            # Ensure both IDs are integers and sort them
            lower_id, higher_id = sorted([int(current_user.id), int(recipient_id)])

            # Query chatroom; note the use of proper conditions with SQLAlchemy.
            chat = user_chat_db.query(Chatroom).filter(
                (Chatroom.first_user_id == lower_id) & (Chatroom.second_user_id == higher_id)
            ).first()
            
            if chat is None:
                # Create a new chatroom if not found.
                new_chat = Chatroom()
                new_chat.first_user_id = lower_id
                new_chat.second_user_id = higher_id
                user_chat_db.add(new_chat)
                user_chat_db.commit()
                user_chat_db.refresh(new_chat)
                chat = new_chat

            # Await the async call to fetch chat history
            chat_history = await chat_history_db["messenger_chat_history"].find_one(
                {"chatroom_id": chat.id}
            )

            if chat_history is None:
                # Create new chat history if none exists
                chat_history = {
                    "chatroom_id": chat.id,
                    "messages": [],
                    "created": datetime.utcnow()
                }
                await chat_history_db["messenger_chat_history"].insert_one(chat_history)

            # Append the new message to the messages list
            chat_history["messages"].append({
                "sender_id": current_user.id,
                "message_text": message_text,
                "timestamp": datetime.now(timezone.utc)
            })

            # Update the chat history document in MongoDB
            await chat_history_db["messenger_chat_history"].update_one(
                {"chatroom_id": chat.id},
                {"$push": {"messages": {
                    "sender_id": current_user.id,
                    "message_text": message_text,
                    "timestamp": datetime.utcnow()
                }}}
            )

            await connectionManager.send_message(
                int(recipient_id), 
                json.dumps({
                    "type": "message",
                    "sender_id": current_user.id,
                    "message": message_text,
                    "timestamp": datetime.utcnow().isoformat()
                })
            )
    except WebSocketDisconnect:
        print(f'user {current_user.username} has been disconnected')
        await connectionManager.disconnection(int(current_user.id))
