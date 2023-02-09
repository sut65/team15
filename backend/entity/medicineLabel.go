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
	Consumption string    `valid:"range(0|100)~Consumption must be Positive, required~Consumption cannot be blank"`
	// Date        time.Time 
	Date        time.Time  `valid:"notpast~Date not be past"`

	OrderID *uint
	Order  Order `gorm:"references:id" valid:"-"`

	SuggestionID *uint  
	Suggestion   Suggestion `gorm:"references:id" valid:"-"`

	EffectID *uint  
	Effect   Effect `gorm:"references:id" valid:"-"`
	
	PharmacistID *uint
	Pharmacist 	  User

	MedicineReceive		[]MedicineReceive`gorm:"foreignKey:MedicineLabelID"`
	
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

func SetTimeValidation() {
	//time not past
	govalidator.CustomTypeTagMap.Set("notpast", func(i interface{}, context interface{}) bool {
		t := i.(time.Time) 
		now := time.Now().Add(time.Hour * 24)
		return t.After(now)
	})
}

func init() {
	SetTimeValidation()
}
