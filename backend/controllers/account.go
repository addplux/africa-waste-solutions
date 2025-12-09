package controllers

import (
	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
)

func CreateAccount(c *fiber.Ctx) error {
	account := new(models.Account)
	if err := c.BodyParser(account); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input"})
	}

	account.KYCStatus = "pending" // Default
	
	if result := models.DB.Create(&account); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create account"})
	}

	return c.JSON(fiber.Map{"status": "success", "data": account})
}

func GetAccounts(c *fiber.Ctx) error {
	var accounts []models.Account
	models.DB.Find(&accounts)
	return c.JSON(fiber.Map{"status": "success", "data": accounts})
}
