package controllers

import (
	"github.com/gofiber/fiber/v2"
)

func GetProducts(c *fiber.Ctx) error {
	products := []string{
		"disposable beverage packages",
		"disposable bottled water packages",
		"disposable peanut butter packages",
		"disposable blue band butter packages",
		"disposable tomato sauce",
		"disposable food spices",
		"disposable mayonnase packages",
		"disposable vinega packages",
		"disposable canned food packages",
		"disposable sachets water packages",
		"disposable meali meal packages",
		"disposable cooking oil packages",
		"disposable Flour packages",
		"disposable Sugar packages",
		"disposable shoe polish packages",
		"disposable floor polish packages",
		"disposable tooth brushes",
		"disposable Liquor packages",
		"disposable cosmetics/body deodorant",
		"disposable Cleaning Agents",
		"disposable pharmaceutical packages",
		"disposable animal feed packages",
		"disposable fertilizer packages",
		"disposable insecticides packages",
		"disposable farm seeds packages",
		"disposable vehicle tyres",
		"disposable bicycle tyres",
		"disposable motorbike tyres",
		"disposable plastic bags",
		"disposable Coca cola",
		"disposable Minute Maid",
		"disposable Molt drink",
	}

	return c.JSON(fiber.Map{"status": "success", "data": products})
}
