package entity

import (
	"time"

	"gorm.io/gorm"
)

type MedicineReceive struct {
	gorm.Model

	RecievedDate time.Time

	PharmacistID *uint
	Pharmacist   User

	MedicineLabelID *uint
	MedicineLabel   MedicineLabel

	//MedicineDisbursement		[]MedicineDisbursement`gorm:"foreignKey:MedicineReceiveID"`

	ZoneID *uint
	Zone   Zone
}
type Zone struct {
	gorm.Model

	ZoneName string

	MedicineReceive []MedicineReceive `gorm:"foreignKey:ZoneID"`
}
