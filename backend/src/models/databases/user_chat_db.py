from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os

from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

USER_DATABASE_URL = os.getenv("USER_DATABASE_URL")

user_chat_engine = create_engine(USER_DATABASE_URL)
user_chat_sessionmaker = sessionmaker(bind=user_chat_engine, autoflush=False)

User_chat_base = declarative_base()