package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineReceive struct {
	gorm.Model
							
	MedicineReceiveNo string	`gorm:"uniqueIndex" valid:"matches(^[B]\\d{5}$)~MedicineReceiveNo must be B then 5 digit,required~MedicineReceiveNo must be B then 5 digit"`
	RecievedDate      time.Time	`valid:"Timenotpast~RecievedDate unsable, Timenotfuture~RecievedDate must not be in the future"`

	PharmacistID *uint
	Pharmacist   User

	MedicineLabelID *uint
	MedicineLabel   MedicineLabel `gorm:"references:id" valid:"-"`

	ZoneID *uint
	Zone   Zone `gorm:"references:id" valid:"-"`

	Discardmedicine       []Discardmedicine      `gorm:"foreignkey:MedicineReceiveID"`
	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineReceiveID"`
}
type Zone struct {
	gorm.Model

	ZoneName string	`gorm:"uniqueIndex"`

	MedicineReceives []MedicineReceive `gorm:"foreignKey:ZoneID"`
}

func init() {

	govalidator.CustomTypeTagMap.Set("Timenotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * -20)
		return t.After(now) || t.Equal(now)
	})

	govalidator.CustomTypeTagMap.Set("Timenotfuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * 20)
		return t.Before(now) || t.Equal(now)
	})
}