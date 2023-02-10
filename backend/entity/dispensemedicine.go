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

	DispenseNo			uint					`valid:"matches(^\\d{6}$)~DispenseNo dose not validate as matches(^\\d{6}$), required~DispenseNo: non zero value required, range(100000|999999)~DispenseNo: range 100000|999999"`
	ReceiveName			string					`valid:"required~ReceiveName cannot be blank"`
	DispenseTime		time.Time				`valid:"donotpast~DispenseTime not be past"`

	PharmacyID 			*uint
	Pharmacy			Pharmacy

	PharmacistID		*uint
	Pharmacist			User

	BillID				*uint
	Bill				Bill

	Return		[]Return `gorm:"foreignKey:DispenseMedicineID"`

	
}
func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}