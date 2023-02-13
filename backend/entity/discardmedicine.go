package entity

import (
	"time"

	"gorm.io/gorm"
)

type Cause struct {
	gorm.Model

	Name              string
	Discardmedicine []Discardmedicine	`gorm:"foreignkey:CauseID"`
}

type Discardmedicine struct {
	gorm.Model

	Quantity int
	Note	string
	Datetime time.Time

	CauseID *uint
	Cause   Cause `gorm:"references:id" valid:"-"`

	MedicineReceiveID *uint
	MedicineReceive MedicineReceive `gorm:"references:id" valid:"-"`

	PharmacistID *uint
	Pharmacist   User `gorm:"references:id" valid:"-"`
}