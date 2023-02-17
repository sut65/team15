package entity

import (
	"time"

	"gorm.io/gorm"
)

type Pay struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:PayID"`
}

type Bill struct {
	gorm.Model

	BillTime time.Time
	Payer    string
	Total    uint
	BillNo   uint

	PaymentmethodID *uint
	Paymentmethod   Paymentmethod `gorm:"references:id" valid:"-"`

	PharmacistID *uint
	Pharmacist   User

	PrescriptionID *uint
	Prescription   Prescription `gorm:"references:id" valid:"-"`

	DispenseMedicines []DispenseMedicine `gorm:"foreignKey:BillID"`
}

type Paymentmethod struct {
	gorm.Model
	Name string

	Bills []Bill `gorm:"foreignKey:PaymentmethodID"`
}
