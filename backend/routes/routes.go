package routes

import (
	"github.com/addplux/africa-waste-solutions/controllers"
	"github.com/addplux/africa-waste-solutions/middleware"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// Accounts
	accounts := api.Group("/accounts")
	accounts.Use(middleware.Protected())
	accounts.Post("/", controllers.CreateAccount)
	accounts.Get("/", controllers.GetAccounts)

	// Entries
	entries := api.Group("/entries")
	entries.Use(middleware.Protected())
	entries.Post("/", controllers.CreateEntry)
	entries.Get("/", controllers.GetEntries)
	
	// Reports
	api.Get("/reports/generate", controllers.GenerateReport)
}
