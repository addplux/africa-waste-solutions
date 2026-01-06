package controllers

import (
	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func GetUserStats(c *fiber.Ctx) error {
	userIDStr, ok := c.Locals("user_id").(string)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "User not authenticated"})
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "error", "message": "Invalid user ID"})
	}

	// Fetch account associated with this user
	var account models.Account
	if err := models.DB.Where("created_by = ?", userID).First(&account).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "error", "message": "Account not found"})
	}

	// Fetch entries for this account
	var entries []models.Entry
	models.DB.Where("source_account_id = ? OR target_account_id = ?", account.ID, account.ID).Find(&entries)

	var supply, distributed, returned int64
	for _, e := range entries {
		total := int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series) + int64(e.HalfDozen)*6

		if e.TransactionType == "supply" && e.SourceAccountID == account.ID {
			supply += total
		} else if e.TransactionType == "transfer" {
			if e.SourceAccountID == account.ID {
				distributed += total
			} else if e.TargetAccountID != nil && *e.TargetAccountID == account.ID {
				supply += total // Received stock
			}
		} else if e.TransactionType == "return" && e.SourceAccountID == account.ID {
			returned += total
		}
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"supply_received": supply,
			"distributed":     distributed,
			"returned":        returned,
			"kyc_status":      account.KYCStatus,
			"account_type":    account.AccountType,
			"balance":         supply - distributed - returned,
		},
	})
}
