# Use slim Python image for performance and size
FROM python:3.12-slim

# Install system dependencies for PostgreSQL and building Python packages
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port 5000
EXPOSE 5000

# Use Gunicorn for production-grade serving
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
