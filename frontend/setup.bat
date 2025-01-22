@echo off

:: Define the container and image names
set CONTAINER_NAME=frontend-dev-container
set IMAGE_NAME=frontend-dev

:: Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Docker is not installed or not in PATH. Please install Docker.
    exit /b 1
)

:: Stop and remove existing container if it exists
echo Stopping and removing existing container (if any)...
docker stop %CONTAINER_NAME% >nul 2>nul
if %errorlevel% neq 0 (
    echo No existing container to stop.
)
docker rm %CONTAINER_NAME% >nul 2>nul
if %errorlevel% neq 0 (
    echo No existing container to remove.
)

:: Build the Docker image
echo Building the Docker image...
docker build -t %IMAGE_NAME% .
if %errorlevel% neq 0 (
    echo Failed to build Docker image. Exiting.
    exit /b 1
)

:: Run the Docker container
echo Running the Docker container...
docker run -it -p 5173:5173 --name %CONTAINER_NAME% %IMAGE_NAME%
if %errorlevel% neq 0 (
    echo Failed to run Docker container. Exiting.
    exit /b 1
)

:: Success message
echo Docker container is running. Visit http://localhost:5173 in your browser.
