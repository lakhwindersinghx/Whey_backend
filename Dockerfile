# Use official Python image
FROM python:3.9

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables (Replace with Clever Cloud MySQL credentials)
ENV DB_HOST="b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com"
ENV DB_USER="uqwyjsbuhrlrac3z"
ENV DB_PASS="R09PlVnu1g53YaUYu1CH"
ENV DB_NAME="b8vtcotaqmvgtuxs8nep"

# Expose port 5000 for backend
EXPOSE 5000

# Run the API server
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app:app", "--bind", "0.0.0.0:5000"]
