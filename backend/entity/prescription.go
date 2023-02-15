package entity

import (
	"time"

	"github.com/asaskevich/govalidator"

	"gorm.io/gorm"
)

type Patient struct {
	gorm.Model

	Name         string
	Sex          string
	Age          int
	Prescription []Prescription `gorm:"foreignKey: PatientID"`
}

type Prescription struct {
	gorm.Model

	Datetime time.Time	`valid:"donotpast~DateTime not be past"`
	Note     string	`valid:"required~Note cannot be blank"`
	Number   int	`valid:"required~Number: non zero value required, range(10000|99999)~Number: range 10000|99999"`

	DoctorID *uint
	Doctor   User

	PatientID *uint
	Patient   Patient

	MedicineLabelID *uint
	MedicineLabel   MedicineLabel

	MedicineArrangements []MedicineArrangement `gorm:"foreignKey: PrescriptionID"`
	Bills                []Bill                `gorm:"foreignKey: PrescriptionID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}