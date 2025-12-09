package controllers

import (
	"time"
	"os"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input"})
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 14)

	user := models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hash),
		Role:         "user", // Default
	}

	if result := models.DB.Create(&user); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create user"})
	}

	return c.JSON(fiber.Map{"status": "success", "user": user})
}

func Login(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid input"})
	}

	var user models.User
	models.DB.Where("email = ?", input.Email).First(&user)

	if user.ID == uuid.Nil {
		return c.Status(404).JSON(fiber.Map{"status": "error", "message": "User not found"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"status": "error", "message": "Invalid password"})
	}

	// Generate JWT
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not login"})
	}

	return c.JSON(fiber.Map{"status": "success", "token": t})
}
