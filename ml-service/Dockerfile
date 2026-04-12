# Use Python 3.12 slim for optimized size
FROM python:3.12-slim

# Install system build tools for Prophet (Stan/GCC)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install (may take a few mins for Prophet)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy logic and app
COPY . .

# Expose port 5001
EXPOSE 5001

# Start the ML API
CMD ["python", "app.py"]
