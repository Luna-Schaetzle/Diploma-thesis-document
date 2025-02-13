# FROM python:3.9-alpine   ##Troubleshooting area
FROM python:3.9-slim

# Install build dependencies including swig and cmake  ##Troubleshooting area
# RUN apk add --no-cache \
#     build-base \
#     swig \
#     cmake \
#     python3-dev

# Set the working directory
WORKDIR /Backend-Strucktured

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --default-timeout=200 --retries=50
# Copy application code
COPY . /Backend-Strucktured
# Create upload directory
RUN mkdir -p /app/uploads-docker

# Expose port
EXPOSE 5000

# Set the working directory for the Flask app
WORKDIR /Backend-Strucktured

# Command to run the Flask app
CMD ["python", "app.py"]