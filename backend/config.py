import os
from dotenv import load_dotenv

load_dotenv()

# Get absolute path for the database file
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'aura_business.db'))
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ML_SERVICE_URL = os.getenv('ML_SERVICE_URL', 'http://localhost:5001')
