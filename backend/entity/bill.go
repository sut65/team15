package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Pay struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:PayID"`
}

type Bill struct {
	gorm.Model

	BillTime time.Time `valid:"DateNotpast~Date must not be in the past, DateNotFuture~Date must not be in the future"`
	Payer    string
	Total    uint `valid:"required~The Total must be in the range 1-10000, range(1|10000)~The Total must be in the range 1-10000"`
	BillNo   uint `valid:"required~The BillNo must be in the range 10000-99999, range(10000|99999)~The BillNo must be in the range 10000-99999"`

	PaymentmethodID *uint
	Paymentmethod   Paymentmethod `gorm:"references:id" valid:"-"`

	PharmacistID *uint
	Pharmacist   User

	PrescriptionID *uint
	Prescription   Prescription `gorm:"references:id" valid:"-"`

	DispenseMedicines []DispenseMedicine `gorm:"foreignKey:BillID"`
}

type Paymentmethod struct {
	gorm.Model
	Name string

	Bills []Bill `gorm:"foreignKey:PaymentmethodID"`
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
