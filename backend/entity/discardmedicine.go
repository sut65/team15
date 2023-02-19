package entity

import (
	"time"
	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Cause struct {
	gorm.Model

	Name              string
	Discardmedicine []Discardmedicine	`gorm:"foreignkey:CauseID"`
}

type Discardmedicine struct {
	gorm.Model

	Quantity int
	Note	string
	Datetime time.Time		`valid:"DateNotpast~Date must not be in the past, DateNotFuture~Date must not be in the future"`

	CauseID *uint
	Cause   Cause `gorm:"references:id" valid:"-"`

	MedicineReceiveID *uint
	MedicineReceive MedicineReceive `gorm:"references:id" valid:"-"`

	PharmacistID *uint
	Pharmacist   User `gorm:"references:id" valid:"-"`
}


func init() {

	govalidator.CustomTypeTagMap.Set("DateNotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * -10)
		return t.After(now) || t.Equal(now)
	})

	govalidator.CustomTypeTagMap.Set("DateNotFuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * 10)
		return t.Before(now) || t.Equal(now)
	})
}