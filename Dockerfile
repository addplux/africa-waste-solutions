FROM golang:1.24-alpine AS builder

WORKDIR /app
# Cache bust: 2026-01-06-Try2
RUN echo "Force rebuild 2026-01-06-Try2"

# Copy backend go.mod from the backend directory
COPY backend/go.mod backend/go.sum ./

RUN go mod download || echo "Skipping download, manual vendor needed if no net"

# Copy all backend files to the container (flattening the structure)
COPY backend/ .

RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
