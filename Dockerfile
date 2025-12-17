FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy backend go.mod from the backend directory
COPY backend/go.mod ./
# COPY backend/go.sum ./

RUN go mod download || echo "Skipping download, manual vendor needed if no net"

# Copy all backend files to the container
COPY backend/ .

RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
