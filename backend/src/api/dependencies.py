from fastapi import Depends, HTTPException,status

from src.config import settings


"""
----------------------- User dependencies (PostgreSQL) -------------------------

db dependencies with sessions and related stuff
"""
from src.models.databases.user_chat_db import user_chat_sessionmaker

def get_user_chat_db_session():
    db = user_chat_sessionmaker()
    try:
        yield db
    finally:
        db.close()
"""
------------------------------------ End ---------------------------------------
"""




"""
----------------------- Authenticational dependencies -------------------------

auth dependencies include authentication, authorization, identication and so on stuff
"""
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
from jwt import PyJWTError

from src.security.utils import get_user_from_database
from src.schemes.TokenData import TokenData
from src.schemes.User import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_user_chat_db_session)):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except PyJWTError:
        raise credentials_exception
    
    user = await get_user_from_database(username = token_data.username, db = db)

    if user is None:
        raise credentials_exception
    
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.disabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user is disabled"
        )
    return current_user


"""
------------------------------------ End ---------------------------------------
"""