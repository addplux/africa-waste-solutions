package controllers

import (
	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
)

func CreateEntry(c *fiber.Ctx) error {
	entry := new(models.Entry)
	if err := c.BodyParser(entry); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input"})
	}

	// Basic validation could go here

	if result := models.DB.Create(&entry); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create entry"})
	}

	return c.JSON(fiber.Map{"status": "success", "data": entry})
}

func GetEntries(c *fiber.Ctx) error {
	var entries []models.Entry
	models.DB.Find(&entries)
	return c.JSON(fiber.Map{"status": "success", "data": entries})
}
