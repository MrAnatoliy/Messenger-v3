from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from src.api.dependencies import get_user_chat_db_session
from src.models.User import User

router = APIRouter()

@router.get("/all")
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_user_chat_db_session)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users