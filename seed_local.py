import requests
from datetime import datetime, timedelta
import random

API_URL = "http://localhost:5000/data/upload"

def seed_industry_data(industry, base_val, growth):
    print(f"Seeding {industry}...")
    data = []
    end_date = datetime.now()
    for i in range(60):
        ds = (end_date - timedelta(days=60-i)).isoformat()
        y = base_val + (i * growth) + random.uniform(-base_val*0.05, base_val*0.05)
        data.append({"ds": ds, "y": y})
    
    response = requests.post(API_URL, json={"data": data, "industry": industry})
    try:
        print(response.json())
    except:
        print(f"Error seeding {industry}. Status: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    seed_industry_data("retail", 100, 1.5)
    seed_industry_data("automotive", 50000, 200)
    seed_industry_data("assets", 1000000, 5000)
