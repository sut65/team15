package entity

import (
	"time"

	"gorm.io/gorm"
)
type Patient struct {
	gorm.Model

	FirstName	string
	LastName	string
	Sex   		string
	Age   		int
	Prescription	[]Prescription			`gorm:"foreignKey: PatientID"`
}

type Prescription struct{
	gorm.Model

	Datetime		time.Time
	Note            string
	Number			int

	DoctorID 		*uint
	Doctor 	  		User

	PatientID		*uint
	Patient		  	Patient

	MedicineArrangements 		[]MedicineArrangement  `gorm:"foreignKey: PrescriptionID"`

}