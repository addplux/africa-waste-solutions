package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
)

// GetInsights fetches recent data and asks AI Service for analysis
func GetInsights(c *fiber.Ctx) error {
	// 1. Fetch recent activity (last 50 entries?)
	var entries []models.Entry
	models.DB.Limit(50).Order("created_at desc").Find(&entries)

	// 2. Prepare payload
	// Simplified summary for AI context
	var summary []string
	for _, e := range entries {
		summary = append(summary, e.TransactionType+": "+e.ProductName)
	}

	payload := map[string]interface{}{
		"context": "supply_chain_analysis",
		"data":    summary,
	}
	jsonPayload, _ := json.Marshal(payload)

	// 3. Call AI Service
	resp, err := http.Post("http://ai-service:5000/analyze", "application/json", bytes.NewBuffer(jsonPayload))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "AI Service unavailable"})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "AI Service error"})
	}

	// Read raw response
	body, _ := io.ReadAll(resp.Body)

	// Attempt to parse JSON if AI returns JSON, otherwise string
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err == nil {
		return c.JSON(fiber.Map{"status": "success", "data": result})
	}

	return c.JSON(fiber.Map{"status": "success", "data": string(body)})
}
