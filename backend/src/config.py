import os
from pathlib import Path
from dotenv import load_dotenv

dotenv_path = Path(".env")
load_dotenv(dotenv_path=dotenv_path)

class ApplicationSettings():
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = "HS512"

settings = ApplicationSettings()