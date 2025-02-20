from fastapi import Depends, HTTPException, WebSocket,status
from fastapi.security.utils import get_authorization_scheme_param 
from jwt import PyJWTError

from src.config import settings


# Chat history dependencies (MongoDB) 
from src.models.databases.chat_history import chat_history_db_client, chat_history_db

async def get_chat_history_db():
    try:
        yield chat_history_db
    finally:
        chat_history_db_client.close()



# User dependencies (PostgreSQL)
from src.models.databases.user_chat_db import user_chat_sessionmaker

def get_user_chat_db_session():
    db = user_chat_sessionmaker()
    try:
        yield db
    finally:
        db.close()




# Authenticational dependencies 
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



async def get_current_user_ws(websocket: WebSocket, db: Session = Depends(get_user_chat_db_session)):
    """
    Extract and validate the JWT from the WebSocket connection headers.
    Closes the connection if authentication fails.
    """
    auth_header = websocket.headers.get("authorization")
    if not auth_header:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    scheme, token = get_authorization_scheme_param(auth_header)
    if scheme.lower() != "bearer" or not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization scheme"
        )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
    except PyJWTError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    # Replace this with your actual DB session dependency or client call.
    user = await get_user_from_database(username=username,db=db)
    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user