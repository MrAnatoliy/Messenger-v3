from fastapi import APIRouter, Depends

from src.api.dependencies import get_current_active_user
from src.api.endpoints import (
    login,
    register,
    hello
)

secure_api_router = APIRouter(
    prefix="/api/v1/secure",
    dependencies = [Depends(get_current_active_user)]
)
secure_api_router.include_router(hello.router, prefix="/hello", tags=["hello"])

auth_api_router = APIRouter(
    prefix="/api/v1",
)
auth_api_router.include_router(login.router, prefix="/login", tags=["login"])
auth_api_router.include_router(register.router, prefix="/register", tags=["register"])