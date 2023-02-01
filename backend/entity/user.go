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
<<<<<<< HEAD
	ClassifyDrug         []ClassifyDrugs       `gorm:"foreignKey:PharmacistID"`
	Prescription         []Prescription        `gorm:"foreignKey:DoctorID"`
	Attendances          []Attendance          `gorm:"foreignKey:PharmacistID"`
=======
	ClassifyDrug      	 []ClassifyDrugs       `gorm:"foreignKey:PharmacistID"`
	Prescription      	 []Prescription        `gorm:"foreignKey:DoctorID"`
	Return               []Return `gorm:"foreignKey:PharmacistID"`
	
>>>>>>> c66f9e12ecea759c2d15d073d6722a2b8c243898

	RoleID *uint
	Role   Role `gorm:"foreignKey:RoleID"`
}
