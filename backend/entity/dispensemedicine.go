package entity

import (
	"time"

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
	DispenseTime		time.Time

	PharmacyID 			*uint
	Pharmacy			Pharmacy

	PharmacistID		*uint
	Pharmacist			User

	Return		[]Return `gorm:"foreignKey:DispenseMedicineID"`

	
}
