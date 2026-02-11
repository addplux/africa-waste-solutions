package controllers

import (
	"encoding/base64"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/addplux/africa-waste-solutions/models"
	"github.com/addplux/africa-waste-solutions/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *fiber.Ctx) error {
	// Parse Multipart Form
	form, err := c.MultipartForm()
	if err != nil {
		fmt.Printf("[DEBUG] MultipartForm Error: %v\n", err)
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Invalid form data"})
	}

	// Logging keys received
	fmt.Printf("[DEBUG] Form Values: %v\n", form.Value)
	for key, files := range form.File {
		fmt.Printf("[DEBUG] Form File Key: %s, Count: %d\n", key, len(files))
		for _, file := range files {
			fmt.Printf("[DEBUG] -> File: %s, Size: %d, Type: %s\n", file.Filename, file.Size, file.Header.Get("Content-Type"))
		}
	}

	// Helper to get form value
	getVal := func(key string) string {
		if val, ok := form.Value[key]; ok && len(val) > 0 {
			return val[0]
		}
		return ""
	}

	name := getVal("name")
	email := getVal("email")
	password := getVal("password")
	contact := getVal("contact")
	plotNumber := getVal("plot_number")
	area := getVal("area")
	accountType := getVal("account_type")
	companyName := getVal("company_name")
	dobStr := getVal("date_of_birth")
	pin := getVal("pin")
	if pin == "" {
		pin = "1234" // Default for MVP, but hashed
	}

	// Basic Validation
	if email == "" || password == "" || name == "" {
		return c.Status(400).JSON(fiber.Map{"status": "error", "message": "Missing required fields"})
	}

	// Parse Date of Birth
	var dob time.Time
	if dobStr != "" {
		dob, _ = time.Parse("2006-01-02", dobStr)
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	pinHash, _ := bcrypt.GenerateFromPassword([]byte(pin), 14)

	// File Upload Handling
	var idDocPath, selfiePath string

	// Ensure directories exist
	os.MkdirAll("./uploads/kyc/ids", os.ModePerm)
	os.MkdirAll("./uploads/kyc/selfies", os.ModePerm)

	// 1. ID Document
	if files, ok := form.File["id_document"]; ok && len(files) > 0 {
		file := files[0]
		filename := uuid.New().String() + "_" + file.Filename

		f, err := file.Open()
		if err == nil {
			defer f.Close()
			path, err := utils.UploadToMinio(c.Context(), filename, f, file.Size, file.Header.Get("Content-Type"))
			if err == nil {
				idDocPath = path
				fmt.Printf("[DEBUG] Saved ID Document to Minio: %s\n", idDocPath)
			} else {
				fmt.Printf("[DEBUG] Error saving ID to Minio: %v\n", err)
			}
		}
	}

	// 2. Selfie (Base64 or File)
	selfieData := getVal("selfie")
	if selfieData != "" {
		// Expecting "data:image/jpeg;base64,..." or just base64
		// Remove header if present
		b64data := selfieData
		if strings.Contains(selfieData, ",") {
			parts := strings.Split(selfieData, ",")
			if len(parts) > 1 {
				b64data = parts[1]
			}
		}

		dec, err := base64.StdEncoding.DecodeString(b64data)
		if err == nil {
			filename := uuid.New().String() + "_selfie.jpg"

			// Use strings.Reader to implement io.Reader for base64 data
			reader := strings.NewReader(string(dec))
			path, err := utils.UploadToMinio(c.Context(), filename, reader, int64(len(dec)), "image/jpeg")
			if err == nil {
				selfiePath = path
				fmt.Printf("[DEBUG] Saved Selfie to Minio: %s\n", selfiePath)
			} else {
				fmt.Printf("[DEBUG] Error saving Selfie to Minio: %v\n", err)
			}
		} else {
			fmt.Printf("[DEBUG] Error decoding selfie base64: %v\n", err)
			fmt.Println("Error decoding selfie base64:", err)
		}
	}
	// Fallback/Override if sent as file (cleaner)
	if files, ok := form.File["selfie_file"]; ok && len(files) > 0 {
		file := files[0]
		filename := uuid.New().String() + "_" + file.Filename

		f, err := file.Open()
		if err == nil {
			defer f.Close()
			path, err := utils.UploadToMinio(c.Context(), filename, f, file.Size, file.Header.Get("Content-Type"))
			if err == nil {
				selfiePath = path
			}
		}
	}

	// Start Transaction
	tx := models.DB.Begin()

	// 1. Create User
	role := "user"
	if email == "admin@aws.com" {
		role = "admin"
	}

	userID := uuid.New()
	user := models.User{
		ID:           userID,
		Name:         name,
		Email:        email,
		PasswordHash: string(hash),
		Role:         role,
		Contact:      contact,
		DateOfBirth:  dob,
	}

	if result := tx.Create(&user); result.Error != nil {
		tx.Rollback()
		fmt.Printf("[ERROR] Register - User creation failed: %v\n", result.Error)
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create user: " + result.Error.Error()})
	}

	// Parse boolean
	isInternational := strings.ToLower(getVal("is_international")) == "true"

	// 2. Create Account
	// If company name is provided, use that for the account Name, otherwise use User Name
	accountName := name
	if companyName != "" {
		accountName = companyName
	}

	accountID := uuid.New()
	account := models.Account{
		ID:              accountID,
		Name:            accountName,
		CompanyName:     companyName,
		Contact:         contact,
		PlotNumber:      plotNumber,
		Area:            area,
		AccountType:     accountType,
		IsInternational: isInternational,
		KYCStatus:       "pending",
		Status:          "active",
		IDDocumentURL:   idDocPath,
		SelfieURL:       selfiePath,
		PinHash:         string(pinHash),
		CreatedBy:       user.ID,
	}

	if result := tx.Create(&account); result.Error != nil {
		tx.Rollback()
		fmt.Printf("[ERROR] Register - Account creation failed: %v\n", result.Error)
		return c.Status(500).JSON(fiber.Map{"status": "error", "message": "Could not create account: " + result.Error.Error()})
	}

	tx.Commit()

	// Generate JWT for Auto-Login
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return c.JSON(fiber.Map{"status": "success", "user": user, "account": account})
	}

	return c.JSON(fiber.Map{
		"status": "success",
		"token":  t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
		"account": account,
	})
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

	return c.JSON(fiber.Map{
		"status": "success",
		"token":  t,
		"user": fiber.Map{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
