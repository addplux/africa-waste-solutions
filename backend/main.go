package main

import (
	"log"
	"os"
	"strings"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/addplux/africa-waste-solutions/routes"
	"github.com/addplux/africa-waste-solutions/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found in parent directory, continuing...")
	}

	models.ConnectDB()
	utils.InitStorage()

	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // 10MB
	})

	// Get CORS origins from environment variable or use default
	corsOrigins := os.Getenv("CORS_ORIGINS")
	if corsOrigins == "" {
		corsOrigins = "http://localhost:5173,http://localhost:5000"
	}

	// Support multiple origins
	allowedOrigins := strings.Split(corsOrigins, ",")
	log.Printf("CORS enabled for origins: %v", allowedOrigins)

	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(allowedOrigins, ","),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	routes.Setup(app)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Validate port is reasonable (max 65535, so 5 digits max)
	if len(port) > 5 {
		log.Printf("Warning: PORT environment variable '%s' is invalid. Falling back to 8080.", port)
		port = "8080"
	}

	log.Printf("Starting server on port %s", port)
	log.Fatal(app.Listen("0.0.0.0:" + port))
}
