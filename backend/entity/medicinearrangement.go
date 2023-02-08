package entity

import (
	"time"

	"gorm.io/gorm"
)
type MedicineArrangement struct {
	gorm.Model

	MedicineArrangementNo   		uint				`valid:"matches(^\\d{6}$)~MedicineArrangementNo dose not validate as matches(^\\d{6}$), required~MedicineArrangementNo: non zero value required, range(200000|999999)~MedicineArrangementNo: range 200000|999999"`
	Note                    		string				`valid:"required~Note cannot be blank"`
	MedicineArrangementTime 		time.Time

	PharmacistID					*uint
	Pharmacist						User  

	ClassifyDrugsID					*uint
	ClassifyDrugs					ClassifyDrugs		`gorm:"references:id" valid:"-"`

	PrescriptionID					*uint
	Prescription					Prescription 		`gorm:"references:id" valid:"-"`


}
