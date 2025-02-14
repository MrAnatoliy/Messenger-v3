from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from src.api.dependencies import get_current_active_user
from src.schemes.User import User
from src.security.security import create_access_token, get_verified_user_from_db

router = APIRouter()

@router.get("/")
async def hello_authenticated_user(current_user: User = Depends(get_current_active_user) ):
    return {
        "message": f'Hello, {current_user.full_name} ({current_user.username})'
    }

@router.get("/test")
async def simple_test():
    return {
        "message": "this message can see only authenticated users!"
    }