from fastapi import Depends
from sqlalchemy.orm import Session

from typing import Annotated

from src.api.dependencies import get_user_chat_db_session
from src.schemes.UserInDB import UserInDB  

from src.models.User import User

async def get_user_from_database(username: str, db: Session) -> UserInDB:
    """
    ## Description
    Gets user from database

    :param username: users username
    :type username: str

    :rtype: UserInDB
    :return: return a scheme UserInDB
    """

    # TODO implement async database requests!
    user = db.query(User).where(User.username == username).first()
    if not user:
        return None
    
    return UserInDB(
        id= str(user.id),
        username= user.username,
        email= user.email,
        full_name= user.full_name,
        disabled= user.disabled,
        hashed_password= user.password_hash
    )