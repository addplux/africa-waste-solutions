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
	account.Status = "active"     // Default

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

func BlockAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	var account models.Account

	if result := models.DB.First(&account, "id = ?", id); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "Account not found"})
	}

	account.Status = "blocked"
	models.DB.Save(&account)

	return c.JSON(fiber.Map{"status": "success", "message": "Account blocked successfully"})
}

func DeleteAccount(c *fiber.Ctx) error {
	id := c.Params("id")
	if result := models.DB.Delete(&models.Account{}, "id = ?", id); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not delete account"})
	}
	return c.JSON(fiber.Map{"status": "success", "message": "Account deleted successfully"})
}
