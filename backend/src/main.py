from fastapi import FastAPI

from pydantic import BaseModel

from src.api.api import secure_api_router
from src.api.api import auth_api_router

app = FastAPI()
app.include_router(auth_api_router)
app.include_router(secure_api_router)
