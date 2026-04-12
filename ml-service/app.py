from flask import Flask, jsonify, request
from flask_cors import CORS
from forecast_logic import perform_forecast

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/forecast', methods=['POST'])
def forecast():
    payload = request.json
    if not payload or 'data' not in payload:
        return jsonify({"error": "No data provided"}), 400
    
    historical_data = payload['data']
    try:
        forecast_results = perform_forecast(historical_data)
        return jsonify({"forecast": forecast_results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
