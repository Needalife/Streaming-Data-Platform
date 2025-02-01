# Use official Golang image
FROM golang:1.19

WORKDIR /Data-Engineering/live-data-service

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Install dependencies
RUN go mod download

# Copy application files
COPY . .

# Build the application
RUN go build -o live-data-service .

# Expose WebSocket port
EXPOSE 8080

# Run the application
CMD ["./live-data-service"]
