package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name         string    `json:"name"`
	Email        string    `gorm:"uniqueIndex" json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"` // admin, field_officer
	DateOfBirth  time.Time `json:"date_of_birth"`
	Contact      string    `json:"contact"`
	CreatedAt    time.Time `json:"created_at"`
}

type Account struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	AccountType     string    `json:"account_type"` // manufacturer, distributor, institution, household
	CompanyName     string    `json:"company_name"` // For business accounts
	Name            string    `json:"name"`         // Primary contact name or household head
	PlotNumber      string    `json:"plot_number"`
	Area            string    `json:"area"`
	Contact         string    `json:"contact"`
	IsInternational bool      `json:"is_international"`

	// KYC Documents
	IDDocumentURL string `json:"id_document_url"`
	SelfieURL     string `json:"selfie_url"`
	KYCStatus     string `json:"kyc_status"` // pending, approved, rejected

	Status    string    `json:"status"` // active, blocked
	CreatedBy uuid.UUID `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}

type Entry struct {
	ID              uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	TransactionType string    `json:"transaction_type"` // supply, transfer, return

	// Transfer Details
	SourceAccountID uuid.UUID  `json:"source_account_id"`
	TargetAccountID *uuid.UUID `json:"target_account_id"` // Nullable (if just manufacturing stock)

	// Authorization
	PinVerified bool `json:"pin_verified"`

	// Product Details
	ProductGroup string `json:"product_group"` // Beverages, Cooking Oil, etc.
	ProductName  string `json:"product_name"`  // Drip package water, Tablet Sugar, etc.

	// Quantities (Bulk Keys)
	Unit      int `json:"unit"`
	Dozen     int `json:"dozen"`
	HalfDozen int `json:"half_dozen"`
	Case      int `json:"case"`
	Series    int `json:"series"` // If relevant

	EntryDate time.Time `json:"entry_date"`
	CreatedBy uuid.UUID `json:"created_by"`
	CreatedAt time.Time `json:"created_at"`
}

type Group struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}
