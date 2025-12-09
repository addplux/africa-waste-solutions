FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod ./
# COPY go.sum ./ 
# Skipping go.sum for now as it doesn't exist yet

RUN go mod download || echo "Skipping download, manual vendor needed if no net"

COPY . .

RUN go build -o main .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
