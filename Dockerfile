# Use official Python image with slim variant for reduced size
FROM python:3.9-slim

# Set environment variables to avoid issues with Python bytecode and buffering
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HOME=/home/appuser

# Create a non-root user for security
RUN useradd -m -d $HOME appuser

# Set working directory
WORKDIR /app

# Install system dependencies (for mysqlclient)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first for better caching
COPY requirements.txt /app/

# Upgrade pip and install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . /app

# Set Clever Cloud MySQL database credentials
ENV DB_HOST="b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com"
ENV DB_USER="uqwyjsbuhrlrac3z"
ENV DB_PASS="R09PlVnu1g53YaUYu1CH"
ENV DB_NAME="b8vtcotaqmvgtuxs8nep"

# Expose backend API port
EXPOSE 5000

# Start the Python backend using Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
