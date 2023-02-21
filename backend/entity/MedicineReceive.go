package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineReceive struct {
	gorm.Model
							
	MedicineReceiveNo string	`gorm:"uniqueIndex" valid:"matches(^[B]\\d{5}$)~MedicineReceiveNo not matche,required~MedicineReceiveNo not matche"`
	RecievedDate      time.Time	`valid:"Timenotpast~RecievedDate unsable, Timenotfuture~DispenseTime must not be in the future"`

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
		return t.After(time.Now().Add(time.Minute * -5)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
	govalidator.CustomTypeTagMap.Set("Timenotfuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * 5)
		return t.Before(now) || t.Equal(now)
	})
}