package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineReceive struct {
	gorm.Model

	MedicineReceiveNo int
	RecievedDate      time.Time

	PharmacistID *uint
	Pharmacist   User

	MedicineLabelID *uint
	MedicineLabel   MedicineLabel		`gorm:"references:id" valid:"-"`

	//MedicineDisbursement		[]MedicineDisbursement`gorm:"foreignKey:MedicineReceiveID"`
	Discardmedicine []Discardmedicine	`gorm:"foreignkey:MedicineReceiveID"`
	ZoneID *uint
	Zone   Zone

	ClassifyDrugs		[]ClassifyDrugs`gorm:"foreignKey:MedicineReceiveID"`
}
type Zone struct {
	gorm.Model

	ZoneName string

	MedicineReceives []MedicineReceive `gorm:"foreignKey:ZoneID"`
}
