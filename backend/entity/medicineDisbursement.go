package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineDisbursement struct {
	gorm.Model

	MedicineDisNo string	`gorm:"uniqueIndex" valid:"matches(^[C]\\d{3}$)~MedicineDisNo must be C then 3 digit,required~MedicineDisNo must be C then 3 digit"`
	Dtime  time.Time		`valid:"Timenotpast~Dtime unsable, Timenotfuture~Dtime must not be in the future"`
	MedicineDisAmount uint	`valid:"required~The MedicineDisAmount must be in the range 1-1000, range(1|1000)~The MedicineDisAmount must be in the range 1-1000"`

	PharmacistID *uint
	Pharmacist   User

	MedicineReceiveID *uint
	MedicineReceive   MedicineReceive `gorm:"references:id" valid:"-"`

	
	MedicineRoomID          *uint
	MedicineRoom            MedicineRoom  `gorm:"references:id" valid:"-"`

	ClassifyDrugs []ClassifyDrugs `gorm:"foreignKey:MedicineDisbursementID"`
}
type MedicineRoom struct {
	gorm.Model

	MRname string  `gorm:"uniqueIndex"`

	MedicineDisbursements []MedicineDisbursement `gorm:"foreignKey:MedicineRoomID"`
}
func init() {
	govalidator.CustomTypeTagMap.Set("Timenotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * -15)
		return t.After(now) || t.Equal(now)
	})
	govalidator.CustomTypeTagMap.Set("Timenotfuture", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		now := time.Now().Add(time.Minute * 15)
		return t.Before(now) || t.Equal(now)
	})
}

