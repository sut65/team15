package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)
type Medicine struct {
	gorm.Model

	Name	string			`gorm:"uniqueIndex"`
	Orders	[]Order			`gorm:"foreignKey:MedicineID"`
}

type Company struct {
	gorm.Model

	Name	string			`gorm:"uniqueIndex"`
	Orders	[]Order			`gorm:"foreignKey:CompanyID"`
}

type Unit struct {
	gorm.Model

	Name	string			`gorm:"uniqueIndex"`
	Orders	[]Order			`gorm:"foreignKey:UnitID"`
}

type Order struct{
	gorm.Model

	Quantity		uint				`valid:"required~The Quantity must be in the range 1-10000, range(1|10000)~The Quantity must be in the range 1-10000"`
	Priceperunit	uint				`valid:"required~The Priceperunit must be in the range 1-10000, range(1|10000)~The Priceperunit must be in the range 1-10000"`
	Datetime		time.Time			`valid:"DateNotpast~Date must not be in the past, DateNotFuture~Date must not be in the future"`

	PharmacistID *uint
	Pharmacist 	  User				

	MedicineID		 *uint
	Medicine		 Medicine		`gorm:"references:id" valid:"-"`

	CompanyID	 *uint
	Company		 Company			`gorm:"references:id" valid:"-"`

	UnitID		 *uint
	Unit		 Unit				`gorm:"references:id" valid:"-"`

	MedicineLabels []MedicineLabel `gorm:"foreignKey:OrderID"`
    Return		   []Return `gorm:"foreignKey:OrderID"`
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