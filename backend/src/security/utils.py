from typing import Annotated

from src.schemes.UserInDB import UserInDB  

async def get_user_from_database(username: str) -> UserInDB:
    """
    ## Description
    Gets user from database

    :param username: users username
    :type username: str

    :rtype: UserInDB
    :return: return a scheme UserInDB 
    """

    if username in fake_users_db:
        user_dict = fake_users_db[username]
        return UserInDB(**user_dict)
    else:
        return None

fake_users_db = {
    "tolik": {
        "username": "tolik",
        "email": "rodionov.tolik@gmail.com",
        "full_name": "Anatoliy Rodionov",
        "hashed_password": "$2b$12$sLL78O/b8m2YbBGCsTwluu8MawFQO/IKh1jDo8XuweJOhDcXMkW4y",
        "disabled": False
    }
}