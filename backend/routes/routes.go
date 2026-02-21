package routes

import (
	"github.com/addplux/africa-waste-solutions/controllers"
	"github.com/addplux/africa-waste-solutions/middleware"
	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api")

	// Serve Static Files (Uploads)
	app.Static("/uploads", "./uploads")

	// Health check endpoint - no database required
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Backend is running",
		})
	})

	// Auth
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
	auth.Get("/stats", middleware.Protected(), controllers.GetUserStats)

	// Accounts
	accounts := api.Group("/accounts")
	accounts.Use(middleware.Protected())
	accounts.Post("/", controllers.CreateAccount)
	accounts.Get("/", controllers.GetAccounts)
	accounts.Post("/:id/block", controllers.BlockAccount)
	accounts.Put("/:id/suspend", controllers.SuspendAccount)
	accounts.Put("/:id/unsuspend", controllers.UnsuspendAccount)
	accounts.Put("/:id/kyc", controllers.UpdateKYCStatus)
	accounts.Delete("/:id", controllers.DeleteAccount)

	// Entries
	entries := api.Group("/entries")
	entries.Use(middleware.Protected())
	entries.Post("/", controllers.CreateEntry)
	entries.Get("/", controllers.GetEntries)
	entries.Delete("/:id", controllers.DeleteEntry)

	// Reports
	api.Get("/reports/stats", controllers.GetDashboardStats)
	api.Get("/reports/export", controllers.GenerateReport)
	api.Get("/reports/insights", controllers.GetInsights)
	api.Get("/reports/account-balances", controllers.GetAccountBalances)

	// Products
	api.Get("/debug/users", func(c *fiber.Ctx) error {
		var count int64
		models.DB.Model(&models.User{}).Count(&count)
		return c.JSON(fiber.Map{"count": count})
	})

	api.Get("/products", controllers.GetProducts)
}
