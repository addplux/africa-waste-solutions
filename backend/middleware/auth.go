package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Missing or malformed JWT"})
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		secret := os.Getenv("JWT_SECRET")

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "error", "message": "Invalid or expired token"})
		}

		// Store user ID in locals
		claims := token.Claims.(jwt.MapClaims)
		c.Locals("user_id", claims["user_id"])
		
		return c.Next()
	}
}
