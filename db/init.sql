-- Initial schema for FDE

CREATE TABLE IF NOT EXISTS historical_data (
    id SERIAL PRIMARY KEY,
    ds TIMESTAMP NOT NULL,
    y FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS forecast_data (
    id SERIAL PRIMARY KEY,
    ds TIMESTAMP NOT NULL,
    yhat FLOAT NOT NULL,
    yhat_lower FLOAT NOT NULL,
    yhat_upper FLOAT NOT NULL
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_historical_ds ON historical_data(ds);
CREATE INDEX IF NOT EXISTS idx_forecast_ds ON forecast_data(ds);

-- Seed some dummy historical data (last 30 days)
INSERT INTO historical_data (ds, y)
SELECT 
    NOW() - (i || ' days')::interval,
    100 + (random() * 20) + (i * 2) -- Some trend + noise
FROM generate_series(1, 30) s(i);
