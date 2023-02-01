package entity

import (
	"gorm.io/gorm"
)

type Role struct {
	gorm.Model

	Name  string
	Users []User `gorm:"foreignKey:RoleID"`
}
type User struct {
	gorm.Model
	Name     string
	UserName string `gorm:"uniqueIndex"`
	Password string

	Orders               []Order               `gorm:"foreignKey:PharmacistID"`
	MedicineLabel        []MedicineLabel       `gorm:"foreignKey:PharmacistID"`
	MedicineArrangements []MedicineArrangement `gorm:"foreignKey:PharmacistID"`
	DispenseMedicines    []DispenseMedicine    `gorm:"foreignKey:PharmacistID"`
	MedicineReceive      []MedicineReceive     `gorm:"foreignKey:PharmacistID"`
	ClassifyDrug         []ClassifyDrugs       `gorm:"foreignKey:PharmacistID"`
	Prescription         []Prescription        `gorm:"foreignKey:DoctorID"`
	Attendances          []Attendance          `gorm:"foreignKey:PharmacistID"`
	Return               []Return              `gorm:"foreignKey:PharmacistID"`

	RoleID *uint
	Role   Role `gorm:"foreignKey:RoleID"`
}
