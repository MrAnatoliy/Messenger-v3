from contextlib import asynccontextmanager
import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket
from motor.motor_asyncio import AsyncIOMotorClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create and attach the MongoDB client and database to app.state
    dotenv_path = Path(".env")
    load_dotenv(dotenv_path=dotenv_path)

    CHAT_HISTORY_DATABASE_URL = os.getenv("CHAT_HISTORY_DATABASE_URL")

    client = AsyncIOMotorClient(CHAT_HISTORY_DATABASE_URL)
    app.state.chat_history_db = client.messenger_chat_history
    yield
    # Shutdown: close the MongoDB client
    client.close()

# Dependency to access the MongoDB database from the request's app state
async def get_chat_history_db(request: Request = None, websocket: WebSocket = None):
    if request:
        return request.app.state.chat_history_db
    elif websocket:
        return websocket.app.state.chat_history_db
