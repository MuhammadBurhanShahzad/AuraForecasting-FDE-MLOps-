import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/fde')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ML_SERVICE_URL = os.getenv('ML_SERVICE_URL', 'http://localhost:5001')
