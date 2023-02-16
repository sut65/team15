package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type Pharmacy struct {
	gorm.Model

	PharmacyBox				uint
	DispenseMedicines		[]DispenseMedicine `gorm:"foreignkey:PharmacyID"`
}
type DispenseMedicine struct {
	gorm.Model

	DispenseNo			uint					`valid:"range(100000|999999)~DispensemedicineNo must be 6 digits, required~DispensemedicineNo must be 6 digits"`
	ReceiveName			string					`valid:"required~ReceiveName cannot be blank"`
	DispenseTime		time.Time				`valid:"donotpast~DispenseTime not be past, donotfuture~DispenseTime must not be in the future"`

	PharmacyID 			*uint
	Pharmacy			Pharmacy				`gorm:"references:id" valid:"-"`

	PharmacistID		*uint
	Pharmacist			User

	BillID				*uint
	Bill				Bill					`gorm:"references:id" valid:"-"`

	Return		[]Return `gorm:"foreignKey:DispenseMedicineID"`

	
}
func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
	govalidator.CustomTypeTagMap.Set("donotfuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * 10)
		return t.Before(now) || t.Equal(now)
	})
}