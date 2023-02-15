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
	MedicineLabel   MedicineLabel `gorm:"references:id" valid:"-"`

	ZoneID *uint
	Zone   Zone

	Discardmedicine       []Discardmedicine      `gorm:"foreignkey:MedicineReceiveID"`
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineReceiveID"`
	ClassifyDrugs []ClassifyDrugs `gorm:"foreignKey:MedicineReceiveID"`
}
type Zone struct {
	gorm.Model

	ZoneName string

	MedicineReceives []MedicineReceive `gorm:"foreignKey:ZoneID"`
}
