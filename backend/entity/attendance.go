package entity

import (
	"time"

	"gorm.io/gorm"
)

type Shift struct {
	gorm.Model

	Name   string
	Orders []Order `gorm:"foreignKey:MedicineID"`
}

type Stat struct {
	gorm.Model

	Name   string
	Orders []Order `gorm:"foreignKey:UnitID"`
}

type Attendance struct {
	gorm.Model

	Phone       string
	Description string
	Datetime    time.Time

	PharmacistID *uint
	Pharmacist   User

	ShiftID *uint
	Shift   Shift

	StatID *uint
	Stat   Stat
}
