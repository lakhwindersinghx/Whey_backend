# Use a stable Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (fix OpenCV, MySQL, and Tesseract errors)
RUN apt-get update && apt-get install -y \
    gcc g++ make pkg-config \
    libgl1-mesa-glx libglib2.0-0 \
    libmariadb-dev-compat libmariadb-dev \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*


# Copy project files
COPY . /app

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Set Clever Cloud MySQL database credentials
ENV DB_HOST="b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com"
ENV DB_USER="uqwyjsbuhrlrac3z"
ENV DB_PASS="R09PlVnu1g53YaUYu1CH"
ENV DB_NAME="b8vtcotaqmvgtuxs8nep"

# Expose backend API port
EXPOSE 5000

# Start the Python backend using Gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
