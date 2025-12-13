package models

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("POSTGRES_DSN")
	if dsn == "" {
		// Fallback for local testing outside docker if env not set
		dsn = "host=localhost user=admin password=secret dbname=waste_db port=5432 sslmode=disable TimeZone=Africa/Lusaka"
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database. \n", err)
	}

	log.Println("Connected to Database!")
	db.Logger = db.Logger.LogMode(4) // Info

	log.Println("Running Migrations...")
	db.AutoMigrate(&User{}, &Account{}, &Entry{}, &Group{})

	DB = db
}
