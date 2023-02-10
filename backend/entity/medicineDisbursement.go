package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineDisbursement struct {
	gorm.Model

	MedicineDisNo int
	Dtime  time.Time

	PharmacistID *uint
	Pharmacist   User

	MedicineReceiveID *uint
	MedicineReceive   MedicineReceive `gorm:"references:id" valid:"-"`

	Discardmedicine []Discardmedicine `gorm:"foreignkey:MedicineReceiveID"`
	
	MedicineRoomID          *uint
	MedicineRoom            MedicineRoom
}
type MedicineRoom struct {
	gorm.Model

	MRname string

	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
}
