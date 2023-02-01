package entity

import (
	"time"

	"gorm.io/gorm"
)

type Return struct{
	gorm.Model
	ReturnDate time.Time

	PharmacistID *uint
	Pharmacist   User

	StaffID  *uint
	Staff    Staff

	DispenseMedicineID *uint
	DispenseMedicine DispenseMedicine

}

type Staff struct{
	gorm.Model

	StaffName string
	Return []Return `gorm:"foreignKey:StaffID"`
}