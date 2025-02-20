import os

from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from dotenv import load_dotenv


dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

CHAT_HISTORY_DATABASE_URL = os.getenv("CHAT_HISTORY_DATABASE_URL")

chat_history_db_client = AsyncIOMotorClient(CHAT_HISTORY_DATABASE_URL)
chat_history_db = chat_history_db_client.messenger_chat_history

