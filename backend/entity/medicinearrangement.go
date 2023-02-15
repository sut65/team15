package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)
type MedicineArrangement struct {
	gorm.Model

	MedicineArrangementNo   		uint				`valid:"range(200000|999999)~MedicineArrangementNo must be 6 digits, required~MedicineArrangementNo must be 6 digits"`
	Note                    		string				`valid:"required~Note cannot be blank"`
	MedicineArrangementTime 		time.Time			`valid:"donotpast~MedicineArrangementTime not be past, donotfuture~MedicineArrangementTime must not be in the future"`

	PharmacistID					*uint
	Pharmacist						User  

	ClassifyDrugsID					*uint
	ClassifyDrugs					ClassifyDrugs		`gorm:"references:id" valid:"-"`

	PrescriptionID					*uint
	Prescription					Prescription 		`gorm:"references:id" valid:"-"`


}
// ตรวจสอบเวลาไม่เป็นอดีต (ไม่เป็นอดีตเกิน 1 นาที)
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