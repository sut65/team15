package entity

import (
	"time"

	"gorm.io/gorm"
)

type Shift struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:ShiftID"`
}

type Stat struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:StatID"`
}

type Attendance struct {
	gorm.Model

	Phone       string
	Description string
	Datetime    time.Time

	PharmacistID *uint
	Pharmacist   User `gorm:"references:id" valid:"-"`

	ShiftID *uint
	Shift   Shift `gorm:"references:id" valid:"-"`

	StatID *uint
	Stat   Stat `gorm:"references:id" valid:"-"`
}
