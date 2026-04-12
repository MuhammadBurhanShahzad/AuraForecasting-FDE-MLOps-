# Stage 1: Build React Dashboard
FROM node:24-alpine as build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Final Monolith Image
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    gcc \
    g++ \
    make \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Setup Backend
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Run DB Initialization
COPY backend/ ./backend/
RUN cd backend && python init_db.py

# Setup ML Service
COPY ml-service/requirements.txt ./ml-service/
RUN pip install --no-cache-dir -r ./ml-service/requirements.txt

# Copy all application code
COPY backend/ ./backend/
COPY ml-service/ ./ml-service/
COPY --from=build-stage /app/frontend/dist /var/www/html/

# Create logs and ensure permissions for SQLite
RUN mkdir -p /var/log && \
    touch /app/backend/aura_business.db && \
    chmod 777 /app/backend/aura_business.db && \
    chmod 777 /app/backend/

# Nginx Configuration for Aura
RUN echo 'server { \
    listen 80; \
    location / { \
        root /var/www/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /data { \
        proxy_pass http://localhost:5000; \
    } \
    location /health { \
        proxy_pass http://localhost:5000; \
    } \
}' > /etc/nginx/sites-available/default && \
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports (Only port 80 is needed now!)
EXPOSE 80

# Start Supervisor to run all 3 services
CMD ["/usr/bin/supervisord"]
