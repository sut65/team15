package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Shift struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:ShiftID"`
}

type Stat struct {
	gorm.Model

	Name        string
	Attendances []Attendance `gorm:"foreignKey:StatID"`
}

type Attendance struct {
	gorm.Model

	Phone       string    `valid:"matches(^\\d{10}$)~Phone must be 10 Digit"`
	Description string    `valid:"required~Description cannot be blank"`
	Datetime    time.Time `valid:"DateNotpast~Date must not be in the past, DateNotFuture~Date must not be in the future"`

	PharmacistID *uint
	Pharmacist   User `gorm:"references:id" valid:"-"`

	ShiftID *uint
	Shift   Shift `gorm:"references:id" valid:"-"`

	StatID *uint
	Stat   Stat `gorm:"references:id" valid:"-"`
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
