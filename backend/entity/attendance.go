package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Statt struct {
	gorm.Model

	Name        string       `gorm:"uniqueIndex"`
	Attendances []Attendance `gorm:"foreignKey:StattID"`
}

type Shift struct {
	gorm.Model

	Name        string       `gorm:"uniqueIndex"`
	Attendances []Attendance `gorm:"foreignKey:ShiftID"`
}

type Attendance struct {
	gorm.Model

	Phone       string    `valid:"matches(^\\d{10}$)~Phone must be 10 Digit"`
	Description uint      `valid:"required~The Description must be in the range 1-10, range(1|10)~The Description must be in the range 1-10"`
	Datetime    time.Time `valid:"DateNotpast~Date must not be in the past, DateNotFuture~Date must not be in the future"`

	PharmacistID *uint
	Pharmacist   User

	StattID *uint
	Statt   Statt `gorm:"references:id" valid:"-"`

	ShiftID *uint
	Shift   Shift `gorm:"references:id" valid:"-"`
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
