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
	// 1. Fetch real data from DB
	var entries []models.Entry
	if result := models.DB.Find(&entries); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not fetch entries"})
	}

	// 2. Aggregate Data by Product
	// Map: Product Name -> {Supply, Disposal}
	type ProductStats struct {
		Supply   int64
		Disposal int64
	}
	stats := make(map[string]*ProductStats)

	for _, e := range entries {
		// Calculate total distinct items (Unit + Case*24 + Dozen*12...)
		// simplified for report: total units
		// _ = int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series) + int64(e.HalfDozen)*6
		// Actually, let's just sum the raw 'Unit' count for simplicity if existing data is messy,
		// OR strictly follow the multiplier logic.
		// For the report let's use a "Total Items" count.
		totalItems := int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series) + int64(e.HalfDozen)*6

		if _, exists := stats[e.ProductName]; !exists {
			stats[e.ProductName] = &ProductStats{}
		}

		if e.TransactionType == "supply" {
			stats[e.ProductName].Supply += totalItems
		} else if e.TransactionType == "return" {
			stats[e.ProductName].Disposal += totalItems
		}
	}

	// Convert map to list for JSON payload
	var records []map[string]interface{}
	for name, stat := range stats {
		if stat.Supply > 0 || stat.Disposal > 0 {
			records = append(records, map[string]interface{}{
				"level":    name, // Using Product Name as "Level"
				"supply":   stat.Supply,
				"disposal": stat.Disposal,
			})
		}
	}

	reportData := map[string]interface{}{
		"account_name": "Africa Waste Solutions", // Could be dynamic based on logged in user
		"period":       "Current System Status",
		"records":      records,
	}

	payload, _ := json.Marshal(reportData)

	// 3. Call AI Service
	resp, err := http.Post("http://ai-service:5000/generate-report", "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Failed to contact AI service: " + err.Error()})
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "AI service returned error"})
	}

	// 4. Stream PDF back to client
	c.Set("Content-Type", "application/pdf")
	c.Set("Content-Disposition", "attachment; filename=waste_report.pdf")

	body, _ := io.ReadAll(resp.Body)
	return c.Send(body)
}

func GetDashboardStats(c *fiber.Ctx) error {
	var entries []models.Entry
	models.DB.Find(&entries)

	var manufactured, distributed, returned int64
	distributorVolumes := make(map[string]int64)
	categoryVolumes := make(map[string]int64)

	// Fetch accounts to map names
	var accounts []models.Account
	models.DB.Find(&accounts)
	accountMap := make(map[string]string)
	for _, a := range accounts {
		name := a.CompanyName
		if name == "" {
			name = a.Name
		}
		accountMap[a.ID.String()] = name
	}

	for _, e := range entries {
		total := int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series) + int64(e.HalfDozen)*6

		if e.TransactionType == "supply" {
			manufactured += total
		} else if e.TransactionType == "transfer" {
			distributed += total
			if e.TargetAccountID != nil {
				distributorVolumes[e.TargetAccountID.String()] += total
			}
		} else if e.TransactionType == "return" {
			returned += total
		}

		if e.ProductGroup != "" {
			categoryVolumes[e.ProductGroup] += total
		}
	}

	// Prepare Top Distributors
	topDistributors := []map[string]interface{}{}
	for id, vol := range distributorVolumes {
		topDistributors = append(topDistributors, map[string]interface{}{
			"name":   accountMap[id],
			"volume": vol,
		})
	}

	// Prepare Categories
	categories := []map[string]interface{}{}
	for cat, vol := range categoryVolumes {
		categories = append(categories, map[string]interface{}{
			"name":   cat,
			"volume": vol,
		})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data": fiber.Map{
			"manufactured":     manufactured,
			"distributed":      distributed,
			"returned":         returned,
			"top_distributors": topDistributors,
			"categories":       categories,
		},
	})
}

func GetAccountBalances(c *fiber.Ctx) error {
	accountID := c.Query("account_id")
	if accountID == "" {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "account_id is required"})
	}

	var entries []models.Entry
	models.DB.Where("source_account_id = ? OR target_account_id = ?", accountID, accountID).Find(&entries)

	type ProductBalance struct {
		Supply int64
		Waste  int64
	}
	balances := make(map[string]*ProductBalance)

	for _, e := range entries {
		total := int64(e.Unit) + int64(e.Case)*24 + int64(e.Dozen)*12 + int64(e.Series) + int64(e.HalfDozen)*6
		if total == 0 {
			continue
		}

		if balances[e.ProductName] == nil {
			balances[e.ProductName] = &ProductBalance{}
		}

		sourceMatch := e.SourceAccountID.String() == accountID
		targetMatch := e.TargetAccountID != nil && e.TargetAccountID.String() == accountID

		if e.TransactionType == "supply" {
			if sourceMatch {
				balances[e.ProductName].Supply += total
			}
		} else if e.TransactionType == "transfer" {
			if sourceMatch {
				balances[e.ProductName].Supply -= total
			}
			if targetMatch {
				balances[e.ProductName].Supply += total
			}
		} else if e.TransactionType == "return" {
			if sourceMatch {
				balances[e.ProductName].Waste += total
			}
		}
	}

	var results []map[string]interface{}
	for product, bal := range balances {
		if bal.Supply != 0 || bal.Waste != 0 {
			results = append(results, map[string]interface{}{
				"product":      product,
				"supply_items": bal.Supply,
				"waste_return": bal.Waste,
			})
		}
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"data":   results,
	})
}
