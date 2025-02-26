from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from src.schemes.UserCreate import UserCreate
from src.models.User import User
from src.api.dependencies import get_user_chat_db_session
from src.security.security import create_access_token, get_password_hash, get_verified_user_from_db
from src.schemes.Token import Token

router = APIRouter()

# Register new user
@router.post("/register", response_model=Token)
async def register_user(user: UserCreate, db: Session = Depends(get_user_chat_db_session)):
    # Check if the username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash the password before saving
    hashed_password = get_password_hash(user.password)

    # Create a new user instance and add to the database
    new_user = User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create access token for the new user
    access_token_expires = timedelta(minutes=60*24)
    access_token = create_access_token(
        data={"sub": new_user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/token", response_model = Token)
async def authenticate(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_user_chat_db_session)):
    user = await get_verified_user_from_db(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="wrong username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=60*24)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }