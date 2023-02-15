package entity

import (
	"time"

	"gorm.io/gorm"
)

type Bill struct {
	gorm.Model

	// BillNo   uint
	BillTime time.Time
	Payer    string
	Total    uint
	BillNo   uint

	PaymentmethodID *uint
	Paymentmethod   Paymentmethod

	PharmacistID *uint
	Pharmacist   User

	PrescriptionID *uint
	Prescription   Prescription

	DispenseMedicines []DispenseMedicine `gorm:"foreignKey:BillID"`
}

type Paymentmethod struct {
	gorm.Model
	Name string

	Bills []Bill `gorm:"foreignKey:PaymentmethodID"`
}
