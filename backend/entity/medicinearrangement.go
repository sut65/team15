package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)
type MedicineArrangement struct {
	gorm.Model

	MedicineArrangementNo   		uint				`valid:"matches(^\\d{6}$)~MedicineArrangementNo dose not validate as matches(^\\d{6}$), required~MedicineArrangementNo: non zero value required, range(200000|999999)~MedicineArrangementNo: range 200000|999999"`
	Note                    		string				`valid:"required~Note cannot be blank"`
	MedicineArrangementTime 		time.Time			`valid:"donotpast~MedicineArrangementTime not be past"`

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
}