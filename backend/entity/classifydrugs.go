package entity

import (
	"time"

	"github.com/asaskevich/govalidator"

	"gorm.io/gorm"
)
type Cupboard struct {
	gorm.Model

	Name	string
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:CupboardID"`
}

type Zonee struct {
	gorm.Model

	Name	string
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:ZoneeID"`
}

type Floor struct {
	gorm.Model

	Number   int
	ClassifyDrugs	[]ClassifyDrugs			`gorm:"foreignKey:FloorID"`
}

type ClassifyDrugs struct{
	gorm.Model

	Datetime		time.Time	`valid:"donotpast~DateTime not be past"`
	Note            string		`valid:"required~Note cannot be blank"`
	Number			int			`valid:"required~Number: non zero value required, range(30000|99999)~Number: range 30000|99999"`

	PharmacistID *uint
	Pharmacist 	  User

	CupboardID		 *uint
	Cupboard		 Cupboard

	ZoneeID		 *uint
	Zonee		 Zonee

	FloorID		 *uint
	Floor		 Floor

	MedicineDisbursementID *uint
	MedicineDisbursement	MedicineDisbursement

	Medicinearrangements		[]MedicineArrangement `gorm:"foreignKey:ClassifyDrugsID"`

}

func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -1)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}