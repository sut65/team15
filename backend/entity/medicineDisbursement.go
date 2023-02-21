package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineDisbursement struct {
	gorm.Model

	MedicineDisNo string
	Dtime  time.Time
	MedicineDisAmount int

	PharmacistID *uint
	Pharmacist   User

	MedicineReceiveID *uint
	MedicineReceive   MedicineReceive `gorm:"references:id" valid:"-"`

	
	MedicineRoomID          *uint
	MedicineRoom            MedicineRoom

	ClassifyDrugs []ClassifyDrugs `gorm:"foreignKey:MedicineDisbursementID"`
}
type MedicineRoom struct {
	gorm.Model

	MRname string

	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
}


