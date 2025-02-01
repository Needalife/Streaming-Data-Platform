# Use official Golang image
FROM golang:1.23.5

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod tidy

# Copy application files
COPY . .

# Build the application
RUN go build -o live-data ./cmd

# Expose WebSocket port
EXPOSE 8080

# Run the application
CMD ["./live-data"]
