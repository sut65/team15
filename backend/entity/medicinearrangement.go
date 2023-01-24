package entity

import (
	"time"

	"gorm.io/gorm"
)
type MedicineArrangement struct {
	gorm.Model

	MedicineArrangementNo   		int
	Note                    		string
	MedicineArrangementTime 		time.Time

	PharmacistID					*uint
	Pharmacist						User  

	ClassifyDrugsID					*uint
	ClassifyDrugs					ClassifyDrugs
}
