package entity

import (
	"time"

	"gorm.io/gorm"
)
type Cupboard struct {
	gorm.Model

	Name	string
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:CupboardID"`
}

type Zonee struct {
	gorm.Model

	Name	string
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:ZoneeID"`
}

type Floor struct {
	gorm.Model

	Number   int
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:FloorID"`
}

type ClassifyDrugs struct{
	gorm.Model

	Datetime		time.Time
	Note            string

	PharmacistID *uint
	Pharmacist 	  User

	CupboardID		 *uint
	Cupboard		 Cupboard

	ZoneeID		 *uint
	Zonee		 Zonee

	FloorID		 *uint
	Floor		 Floor

	Medicinearrangements		[]MedicineArrangement `gorm:"foreignKey:ClassifyDrugsID"`

}