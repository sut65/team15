package entity

import (
	"time"

	"gorm.io/gorm"

	"github.com/asaskevich/govalidator"
)

type Return struct{
	gorm.Model
	

	Note string `valid:"required~Note cannot be blank"`
	Unitt string    `valid:"range(0|100)~Unitt must be Positive"`
    


	PharmacistID *uint
	Pharmacist   User

	StaffID  *uint
	Staff    Staff  `gorm:"references:id" valid:"-"`

	ReasonID  *uint
	Reason    Reason

	DispenseMedicineID *uint
	DispenseMedicine DispenseMedicine  `gorm:"references:id" valid:"-"`

	
	OrderID *uint
	Order  Order  `gorm:"references:id" valid:"-"`

	ReturnDate        time.Time  `valid:"donotpast~Return not be past"`

}

type Staff struct{
	gorm.Model

	StaffName string  `gorm:"uniqueIndex"`
	Return []Return `gorm:"foreignKey:StaffID"`
}

type Reason struct{
	gorm.Model

	ReasonName string  `gorm:"uniqueIndex"`
	Return     []Return `gorm:"foreignKey:ReasonID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}



