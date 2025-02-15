# Use Golang base image
FROM golang:1.23.6

# Set working directory
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies
RUN go mod tidy

# Build the application
RUN go build -o live-data cmd/main.go

# Expose WebSocket port
EXPOSE 8091

# Run the service
CMD ["/app/live-data"]
