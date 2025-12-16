package main

import (
	"log"
	"os"
	"strings"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/addplux/africa-waste-solutions/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found in parent directory, continuing...")
	}

	models.ConnectDB()

	app := fiber.New()

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

	log.Printf("Starting server on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
