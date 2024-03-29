package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
	"gorm.io/gorm"
)

type MedicineLabel struct {
	gorm.Model
	Instruction string    `valid:"required~Instruction cannot be blank"`
	Property    string    `valid:"required~Property cannot be blank"`
	Consumption   		uint	`valid:"required~The Consumption must be in the range 1-100, range(1|100)~The Consumption must be in the range 1-100"`
	// Date        time.Time 
	Date        time.Time  `valid:"donotpast~MedicineLabel not be past"`

	OrderID *uint
	Order  Order `gorm:"references:id" valid:"-"`

	SuggestionID *uint  
	Suggestion   Suggestion `gorm:"references:id" valid:"-"`

	EffectID *uint  
	Effect   Effect `gorm:"references:id" valid:"-"`
	
	PharmacistID *uint
	Pharmacist 	  User

	MedicineReceive		[]MedicineReceive`gorm:"foreignKey:MedicineLabelID"`
	Prescription		[]Prescription`gorm:"foreignKey:MedicineLabelID"`
	
}

type Suggestion struct {
	gorm.Model
	SuggestionName string          `gorm:"uniqueIndex"`
	MedicineLabels []MedicineLabel `gorm:"foreignKey:SuggestionID"`
}
type Effect struct {
	gorm.Model
	EffectName     string          `gorm:"uniqueIndex"`
	MedicineLabels []MedicineLabel `gorm:"foreignKey:EffectID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("donotpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(time.Minute * -10)) //เวลา > เวลาปัจจุบัน - 1 นาที
	})
}