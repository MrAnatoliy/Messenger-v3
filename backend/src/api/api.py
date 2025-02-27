from fastapi import APIRouter, Depends

from src.api.endpoints.auth import auth
from src.api.dependencies import get_current_active_user
from src.api.endpoints.auth import (
    auth
)

from src.api.endpoints.user_chat_db import (
    user_crud,
    chat_crud
)

from src.api.endpoints.chat import (
    message
)

# -------------------------------- Auth routes ---------------------------------------
auth_api_router = APIRouter(
    prefix="/api/v1",
)
auth_api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
auth_api_router.include_router(message.router, prefix="/message", tags=["message"])
#-------------------------------------------------------------------------------------


#--------------------------------- Secured routes ------------------------------------
secure_api_router = APIRouter(
    prefix="/api/v1/secure",
    dependencies = [Depends(get_current_active_user)]
)
secure_api_router.include_router(user_crud.router, prefix="/user", tags=["user"])
secure_api_router.include_router(chat_crud.router, prefix="/chatroom", tags=["chatroom"])
#-------------------------------------------------------------------------------------