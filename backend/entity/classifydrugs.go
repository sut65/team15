package entity

import (
	"time"

	"gorm.io/gorm"
)
type Cupboard struct {
	gorm.Model

	Name	string
	Zone    string
	Floor   int
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:CupboardID"`
}

type ClassifyDrugs struct{
	gorm.Model

	Datetime		time.Time
	Note            string

	PharmacistID *uint
	Pharmacist 	  User

	CupboardID		 *uint
	Cupboard		 Cupboard

	medicinearrangements		[]MedicineArrangement `gorm:"foreignKey:ClassifyDrugsID"`

}