package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineDisbursement struct {
	gorm.Model

	MedicineDisNo int
	Dtime  time.Time
	MedicineDisAmount int

	PharmacistID *uint
	Pharmacist   User

	MedicineReceiveID *uint
	MedicineReceive   MedicineReceive `gorm:"references:id" valid:"-"`

	Discardmedicine []Discardmedicine `gorm:"foreignkey:MedicineReceiveID"`
	
	MedicineRoomID          *uint
	MedicineRoom            MedicineRoom

	DrugUnitID          *uint
	DrugUnit            DrugUnit


	ClassifyDrugs		[]ClassifyDrugs`gorm:"foreignKey:MedicineDisbursementID"`
	
}
type MedicineRoom struct {
	gorm.Model

	MRname string

	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
}
type DrugUnit struct {
	gorm.Model

	DUname string

	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:DrugUnitID"`
}
