from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, HistoricalData, ForecastData
from config import Config
import requests
from datetime import datetime
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

metrics = PrometheusMetrics(app)
metrics.info('app_info', 'Aura Forecasting Application info', version='1.0.0')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/data/historical', methods=['GET'])
def get_historical():
    industry = request.args.get('industry', 'retail')
    business_id = request.args.get('business_id', 'demo')
    data = HistoricalData.query.filter_by(industry=industry, business_id=business_id).order_by(HistoricalData.ds).all()
    return jsonify([d.to_dict() for d in data])

@app.route('/data/forecast', methods=['GET'])
def get_forecast():
    industry = request.args.get('industry', 'retail')
    business_id = request.args.get('business_id', 'demo')
    data = ForecastData.query.filter_by(industry=industry, business_id=business_id).order_by(ForecastData.ds).all()
    return jsonify([d.to_dict() for d in data])

import traceback

@app.route('/data/upload', methods=['POST'])
def upload_data():
    try:
        payload = request.json
        if not payload or 'data' not in payload:
            return jsonify({"error": "No data provided"}), 400
        
        industry = payload.get('industry', 'retail')
        business_id = payload.get('business_id', 'demo')
        
        if payload.get('clear_existing'):
            HistoricalData.query.filter_by(industry=industry, business_id=business_id).delete()
            ForecastData.query.filter_by(industry=industry, business_id=business_id).delete()

        for item in payload['data']:
            ds = datetime.fromisoformat(item['ds'])
            y = item['y']
            new_entry = HistoricalData(ds=ds, y=y, industry=industry, business_id=business_id)
            db.session.add(new_entry)
        
        db.session.commit()
        return jsonify({"message": f"Successfully uploaded {len(payload['data'])} records"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e), "traceback": traceback.format_exc()}), 500

@app.route('/data/trigger-forecast', methods=['POST'])
def trigger_forecast():
    payload = request.json or {}
    industry = payload.get('industry', 'retail')
    business_id = payload.get('business_id', 'demo')
    
    # 1. Fetch historical data for this specific business and industry
    historical_data = HistoricalData.query.filter_by(industry=industry, business_id=business_id).order_by(HistoricalData.ds).all()
    if not historical_data:
        return jsonify({"error": f"No historical data for {business_id} to forecast from"}), 400
    
    # 2. Call ML Service
    try:
        data_payload = [{"ds": d.ds.isoformat(), "y": d.y} for d in historical_data]
        response = requests.post(f"{app.config['ML_SERVICE_URL']}/forecast", json={"data": data_payload})
        
        if response.status_code != 200:
            error_msg = response.json().get('error', 'Unknown error in ML service')
            return jsonify({"error": f"Aura Intelligence Error: {error_msg}"}), 500
            
        forecast_results = response.json()['forecast']
        
        # 3. Clear old forecast for this business and industry
        ForecastData.query.filter_by(industry=industry, business_id=business_id).delete()
        
        # 4. Save new forecast
        for item in forecast_results:
            new_forecast = ForecastData(
                ds=datetime.fromisoformat(item['ds']),
                yhat=item['yhat'],
                yhat_lower=item['yhat_lower'],
                yhat_upper=item['yhat_upper'],
                industry=industry,
                business_id=business_id
            )
            db.session.add(new_forecast)
        
        db.session.commit()
        return jsonify({"message": f"Forecast for {business_id} ({industry}) generated successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Basic DB init
    app.run(host='0.0.0.0', port=5000)
