from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext # type: ignore

import jwt

from src.config import settings
from src.schemes.UserInDB import UserInDB
from src.security.utils import get_user_from_database


crypt_context = CryptContext(schemes=["bcrypt"])

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    data_to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)

    data_to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(data_to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt

async def get_verified_user_from_db(username: str, password: str):
    """
    ## Description
    Function for getting user from database and verifying his password by checking provided plaintext with users hashed password
    
    :param username: users username
    :type username: str
    :param password: users plaintext password
    :type password: str
  
    :rtype: UserInDB
    :return: return a scheme UserInDB
    """

    user: UserInDB = await get_user_from_database(username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

def verify_password(plaintext_password: str, hashed_password: str):
    return crypt_context.verify(plaintext_password, hashed_password)

def get_password_hash(plaintext_password: str):
    return crypt_context.hash(plaintext_password)