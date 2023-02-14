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

	Quantity		int				`valid:"range(1|10000)~Consumption must be Positive, required~Consumption cannot be blank"`
	Priceperunit	int				
	Datetime		time.Time		

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
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}