package controllers

import (
	"time"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func CreateEntry(c *fiber.Ctx) error {
	// Input struct including PIN
	var input struct {
		TransactionType string     `json:"transaction_type"`
		SourceAccountID uuid.UUID  `json:"source_account_id"`
		TargetAccountID *uuid.UUID `json:"target_account_id"`
		Pin             string     `json:"pin"`
		ProductGroup    string     `json:"product_group"`
		ProductName     string     `json:"product_name"`
		Unit            int        `json:"unit"`
		Dozen           int        `json:"dozen"`
		HalfDozen       int        `json:"half_dozen"`
		Case            int        `json:"case"`
		Series          int        `json:"series"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input format"})
	}

	// 1. PIN Verification (Mock for now, or check against '1234')
	if input.Pin != "1234" {
		return c.Status(401).JSON(fiber.Map{"status": "error", "message": "Invalid Authorization PIN"})
	}

	// 2. Map to Entry Model
	entry := models.Entry{
		TransactionType: input.TransactionType,
		SourceAccountID: input.SourceAccountID,
		TargetAccountID: input.TargetAccountID,
		PinVerified:     true,
		ProductGroup:    input.ProductGroup,
		ProductName:     input.ProductName,
		Unit:            input.Unit,
		Dozen:           input.Dozen,
		HalfDozen:       input.HalfDozen,
		Case:            input.Case,
		Series:          input.Series,
		EntryDate:       time.Now(),
	}

	// 3. Validation
	if entry.SourceAccountID == uuid.Nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Source Account is required"})
	}

	if result := models.DB.Create(&entry); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not record transaction"})
	}

	return c.JSON(fiber.Map{"status": "success", "data": entry})
}

func GetEntries(c *fiber.Ctx) error {
	var entries []models.Entry
	models.DB.Find(&entries)
	return c.JSON(fiber.Map{"status": "success", "data": entries})
}
