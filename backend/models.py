from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class HistoricalData(db.Model):
    __tablename__ = 'historical_data'
    id = db.Column(db.Integer, primary_key=True)
    ds = db.Column(db.DateTime, nullable=False, index=True) # Date stamp
    y = db.Column(db.Float, nullable=False)               # Value
    industry = db.Column(db.String(50), nullable=False, default='retail')
    business_id = db.Column(db.String(100), nullable=False, default='demo', index=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "ds": self.ds.isoformat(),
            "y": self.y,
            "industry": self.industry,
            "business_id": self.business_id
        }

class ForecastData(db.Model):
    __tablename__ = 'forecast_data'
    id = db.Column(db.Integer, primary_key=True)
    ds = db.Column(db.DateTime, nullable=False, index=True) # Date stamp
    yhat = db.Column(db.Float, nullable=False)              # Predicted value
    yhat_lower = db.Column(db.Float, nullable=False)        # Confidence lower bound
    yhat_upper = db.Column(db.Float, nullable=False)        # Confidence upper bound
    industry = db.Column(db.String(50), nullable=False, default='retail')
    business_id = db.Column(db.String(100), nullable=False, default='demo', index=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "ds": self.ds.isoformat(),
            "yhat": self.yhat,
            "yhat_lower": self.yhat_lower,
            "yhat_upper": self.yhat_upper,
            "industry": self.industry,
            "business_id": self.business_id
        }
