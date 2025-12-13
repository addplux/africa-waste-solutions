package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
)

func GenerateReport(c *fiber.Ctx) error {
	// 1. Fetch data for the report (Mocking data for now, normally would query DB)
	var entries []models.Entry
	models.DB.Find(&entries)

	reportData := map[string]interface{}{
		"account_name": "Test Account",
		"period":       "December 2024",
		"records": []map[string]interface{}{
			{"level": 12, "supply": 1000, "disposal": 300}, // simplified
			{"level": 16, "supply": 500, "disposal": 100},
		},
	}

	payload, _ := json.Marshal(reportData)

	// 2. Call AI Service
	resp, err := http.Post("http://ai-service:5000/generate-report", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to contact AI service"})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "AI service returned error"})
	}

	// 3. Stream PDF back to client
	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", "attachment; filename=waste_report.pdf")

	body, _ := io.ReadAll(resp.Body)
	return c.Send(body)
}

func GetDashboardStats(c *fiber.Ctx) error {
	var entries []models.Entry
	models.DB.Find(&entries)

	var manufactured, distributed, returned int64

	for _, e := range entries {
		// Calculate total units (Simple Sum for MVP)
		// Only counting 'Case' magnitude for big numbers, or strict sum?
		// Let's sum Case + Unit for a "Total Items" proxy.
		total := int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series)

		if e.TransactionType == "supply" {
			manufactured += total
		} else if e.TransactionType == "transfer" {
			distributed += total
		} else if e.TransactionType == "return" {
			returned += total
		}
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"manufactured": manufactured,
			"distributed":  distributed,
			"returned":     returned,
		},
	})
}
