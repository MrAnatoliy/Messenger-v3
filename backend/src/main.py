from contextlib import asynccontextmanager
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from src.models.databases.chat_history import lifespan
from src.api.api import secure_api_router
from src.api.api import auth_api_router


app = FastAPI(lifespan = lifespan)
app.include_router(auth_api_router)
app.include_router(secure_api_router)

origins = [
    "http://localhost:5173",  # Replace with your client's URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Allows only the specified origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)