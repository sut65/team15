package entity

import (
	"time"

	"gorm.io/gorm"
)

type Return struct{
	gorm.Model
	ReturnDate time.Time

	Note string `valid:"required~Note cannot be blank"`

	PharmacistID *uint
	Pharmacist   User

	StaffID  *uint
	Staff    Staff  `gorm:"references:id" valid:"-"`

	ReasonID  *uint
	Reason    Reason

	DispenseMedicineID *uint
	DispenseMedicine DispenseMedicine  `gorm:"references:id" valid:"-"`

	
	OrderID *uint
	Order  Order  `gorm:"references:id" valid:"-"`

}

type Staff struct{
	gorm.Model

	StaffName string  `gorm:"uniqueIndex"`
	Return []Return `gorm:"foreignKey:StaffID"`
}

type Reason struct{
	gorm.Model

	ReasonName string  `gorm:"uniqueIndex"`
	Return     []Return `gorm:"foreignKey:ReasonID"`
}