package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name         string    `json:"name"`
	Email        string    `gorm:"uniqueIndex" json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"` // admin, field_officer
	CreatedAt    time.Time `json:"created_at"`
}

type Account struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	AccountType     string    `json:"account_type"` // business, consumer
	Name            string    `json:"name"`
	PlotNumber      string    `json:"plot_number"`
	Area            string    `json:"area"`
	Contact         string    `json:"contact"`
	IsInternational bool      `json:"is_international"`
	KYCStatus       string    `json:"kyc_status"` // pending, approved, rejected
	CreatedBy       uuid.UUID `json:"created_by"`
	CreatedAt       time.Time `json:"created_at"`
}

type Entry struct {
	ID            uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	AccountID     uuid.UUID      `json:"account_id"`
	EntryDate     time.Time      `json:"entry_date"`
	PackageLevels datatypes.JSON `json:"package_levels"` // JSON: {"12": 1000, "16": 500}
	WasteLevels   datatypes.JSON `json:"waste_levels"`   // JSON: {"12": 200}
	CreatedBy     uuid.UUID      `json:"created_by"`
	CreatedAt     time.Time      `json:"created_at"`
}

type Group struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
}
