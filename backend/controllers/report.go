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
