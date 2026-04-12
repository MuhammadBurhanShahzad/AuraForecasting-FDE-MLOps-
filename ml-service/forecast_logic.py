from prophet import Prophet
import pandas as pd
import logging

# Setup logging to see errors in the console
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def perform_forecast(historical_data, periods=30):
    try:
        # 1. Convert to DataFrame
        df = pd.DataFrame(historical_data)
        
        if df.empty:
            raise ValueError("Historical data is empty.")
            
        # 2. Pre-process: Ensure numeric Y and datetime DS
        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        
        # 3. Drop any rows with invalid dates or values
        df = df.dropna(subset=['ds', 'y'])
        
        if len(df) < 2:
            raise ValueError("At least 2 valid data points are required for Aura AI to analyze trends.")

        # 4. Initialize and fit Prophet (with simplified settings for small datasets)
        # We disable daily/weekly seasonality if data is too sparse to avoid errors
        model = Prophet(
            yearly_seasonality='auto',
            weekly_seasonality='auto',
            daily_seasonality=False
        )
        
        logger.info(f"Fitting model with {len(df)} points...")
        model.fit(df)
        
        # 5. Create future dataframe
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        
        # 6. Extract only the future part (where ds > max historical ds)
        future_forecast = forecast[forecast['ds'] > df['ds'].max()]
        
        # 7. Convert to JSON serializable list
        results = future_forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict('records')
        for row in results:
            row['ds'] = row['ds'].isoformat()
            
        return results
        
    except Exception as e:
        logger.error(f"Prophet Error: {str(e)}")
        raise e
