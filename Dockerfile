# Stage 1: Build Frontend
FROM node:24-alpine as build-stage
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Final Image
FROM python:3.12-slim
WORKDIR /app

# Install essentials
RUN apt-get update && apt-get install -y nginx supervisor libpq-dev && rm -rf /var/lib/apt/lists/*

# Install all requirements
COPY backend/requirements.txt ./backend/
COPY ml-service/requirements.txt ./ml-service/
RUN pip install --no-cache-dir -r ./backend/requirements.txt -r ./ml-service/requirements.txt

# Copy application code
COPY backend/ ./backend/
COPY ml-service/ ./ml-service/
COPY --from=build-stage /app/frontend/dist /var/www/html/
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# DB Init and Permissions
RUN cd backend && python init_db.py && \
    touch /app/backend/aura_business.db && \
    chmod 777 /app/backend/aura_business.db /app/backend/

# Simplified Nginx Config for React + Backend (including /metrics)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /var/www/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location ~ ^/(data|health|metrics) { \
        proxy_pass http://localhost:5000; \
    } \
}' > /etc/nginx/sites-available/default && \
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

EXPOSE 80
CMD ["/usr/bin/supervisord"]
