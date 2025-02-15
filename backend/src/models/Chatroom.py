from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from src.models.databases.user_chat_db import User_chat_base

class Chatroom(User_chat_base):
    __tablename__ = 'chatroom'
    id = Column(Integer, primary_key=True)
    first_user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    second_user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    first_user = relationship(
        'User',
        foreign_keys=[first_user_id],
        back_populates='chatrooms_as_first_user'
    )
    second_user = relationship(
        'User',
        foreign_keys=[second_user_id],
        back_populates='chatrooms_as_second_user'
    )

    def __repr__(self):
        return f"<Chatroom(id={self.id}, first_user_id={self.first_user_id}, second_user_id={self.second_user_id})>"