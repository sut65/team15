package entity

import (
	"time"

	"gorm.io/gorm"
)
type Medicine struct {
	gorm.Model

	Name	string
	Orders	[]Order			`gorm:"foreignKey:MedicineID"`
}

type Company struct {
	gorm.Model

	Name	string
	Orders	[]Order			`gorm:"foreignKey:CompanyID"`
}

type Unit struct {
	gorm.Model

	Name	string
	Orders	[]Order			`gorm:"foreignKey:UnitID"`
}

type Order struct{
	gorm.Model

	Quantity		int	
	Priceperunit	int
	Datetime		time.Time

	PharmacistID *uint
	Pharmacist 	  User

	MedicineID		 *uint
	Medicine		 Medicine

	CompanyID	 *uint
	Company		 Company

	UnitID		 *uint
	Unit		 Unit

	MedicineLabels []MedicineLabel `gorm:"foreignKey:OrderID"`

}