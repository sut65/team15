package entity

import (
	"time"

	"gorm.io/gorm"
)

type Return struct{
	gorm.Model
	ReturnDate time.Time

	Note string 

	PharmacistID *uint
	Pharmacist   User

	StaffID  *uint
	Staff    Staff

	ReasonID  *uint
	Reason    Reason

	DispenseMedicineID *uint
	DispenseMedicine DispenseMedicine

}

type Staff struct{
	gorm.Model

	StaffName string
	Return []Return `gorm:"foreignKey:StaffID"`
}

type Reason struct{
	gorm.Model

	ReasonName string
	Return []Return `gorm:"foreignKey:StaffID"`
}