from pydantic import BaseModel

from src.schemes.User import User

class UserInDB(User):
    hashed_password: str
    
    class Config:
        orm_mode = True