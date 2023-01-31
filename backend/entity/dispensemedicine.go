package entity

import (
	"time"

	"gorm.io/gorm"
)

type Pharmacy struct {
	gorm.Model

	PharmacyBox				int
	DispenseMedicines		[]DispenseMedicine `gorm:"foreignkey:PharmacyID"`
}
type DispenseMedicine struct {
	gorm.Model

	DispenseNo			int
	ReceiveName			string
	DispenseTime		time.Time

	PharmacyID 			*uint
	Pharmacy			Pharmacy

	PharmacistID		*uint
	Pharmacist			User

	Return		[]Return `gorm:"foreignKey:DispenseMedicineID"`

	
}
