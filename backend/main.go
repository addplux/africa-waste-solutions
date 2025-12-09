package main

import (
	"log"
	
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

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Frontend URL
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	routes.Setup(app)

	log.Fatal(app.Listen(":8080")) // Listen on port 8080
}
