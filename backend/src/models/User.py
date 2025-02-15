from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship

from src.models.databases.user_chat_db import User_chat_base
from src.models.Chatroom import Chatroom

class User(User_chat_base):
    __tablename__ = 'users'  # table names are usually lowercase
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    full_name = Column(String(255))
    password_hash = Column(String(255), nullable=False)
    previous_password_hash = Column(String(255))
    disabled = Column(Boolean, nullable=False, default=False)

    # Define relationships for chatrooms where this user is either the first or second participant.
    chatrooms_as_first_user = relationship(
        'Chatroom',
        foreign_keys='Chatroom.first_user_id',
        back_populates='first_user',
        cascade="all, delete-orphan"
    )
    chatrooms_as_second_user = relationship(
        'Chatroom',
        foreign_keys='Chatroom.second_user_id',
        back_populates='second_user',
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"