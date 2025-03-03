#!/bin/bash

# Define the container and image names
CONTAINER_NAME="frontend-dev-container"
IMAGE_NAME="frontend-dev"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed or not in PATH. Please install Docker."
    exit 1
fi

# Stop and remove existing container if it exists
echo "Stopping and removing existing container (if any)..."
docker stop $CONTAINER_NAME &> /dev/null
docker rm $CONTAINER_NAME &> /dev/null

# Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME .
if [ $? -ne 0 ]; then
    echo "Failed to build Docker image. Exiting."
    exit 1
fi

# Run the Docker container
echo "Running the Docker container..."
docker run -it -p 5173:5173 --name $CONTAINER_NAME $IMAGE_NAME
if [ $? -ne 0 ]; then
    echo "Failed to run Docker container. Exiting."
    exit 1
fi

# Success message
echo "Docker container is running. Visit http://localhost:5173 in your browser."