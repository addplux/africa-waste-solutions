package controllers

import (
	"time"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateEntry(c *fiber.Ctx) error {
	entry := new(models.Entry)

	if err := c.BodyParser(entry); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input format"})
	}

	// Set default date if empty
	if entry.EntryDate.IsZero() {
		entry.EntryDate = time.Now()
	}

	// Basic validation
	if entry.ProductGroup == "" || entry.AccountID == uuid.Nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Missing required fields (Account or Product Group)"})
	}

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
