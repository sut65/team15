package entity

 

import (
			"time"
           "gorm.io/gorm"
		   "golang.org/x/crypto/bcrypt"
           "gorm.io/driver/sqlite"

)

 

var db *gorm.DB

 

func DB() *gorm.DB {

           return db

}

 

func SetupDatabase() {

	database, err := gorm.Open(sqlite.Open("MedicineRoom.db"), &gorm.Config{})
	 // Migrate the schema
	 if err != nil {

        panic("failed to connect database")

  }
	 database.AutoMigrate(
		&Role{},
		&User{},
		&Medicine{},
		&Company{},
		&Unit{},
		&Order{}, 
		&MedicineArrangement{},
	 )
  	
	 


	 db = database



//ตำแหน่งงาน
	 role1 := Role{
		Name: "Phaemacist",
	 }
	 db.Model(&Role{}).Create(&role1)

	 role2 := Role{
		Name: "Dortor",
	 }
	 db.Model(&Role{}).Create(&role2)

	 // User
	 password1, err := bcrypt.GenerateFromPassword([]byte("1234"), 14)
	 password2, err := bcrypt.GenerateFromPassword([]byte("5678"), 14)

	 doctor := User{
		Name: "sirinthip",
		UserName: "B6221126",
		Password: string(password2),
		Role: role2,
	 }
	 db.Model(&User{}).Create(&doctor)

	 pharmacist1 := User{
		Name: "warangkana",
		UserName:  "B6201562",
		Password: string(password1),
		Role: role1,
	 }
	 db.Model(&User{}).Create(&pharmacist1)

	 pharmacist2 := User{
		Name: "supaporn",
		UserName:  "B6216948",
		Password: string(password1),
		Role: role1,
	 }
	 db.Model(&User{}).Create(&pharmacist2)

	 pharmacist3 := User{
		Name: "jirawat",
		UserName:  "B6221928",
		Password: string(password1),
		Role: role1,
	 }
	 db.Model(&User{}).Create(&pharmacist3)

	 pharmacist4 := User{
		Name: "woottikrai",
		UserName:  "B6224356",
		Password: string(password1),
		Role: role1,
	 }
	 db.Model(&User{}).Create(&pharmacist4)
	 pharmacist5 := User{
		Name: "nawamin",
		UserName:  "B6226916",
		Password: string(password1),
		Role: role1,
	 }
	 db.Model(&User{}).Create(&pharmacist5)

	//ยา
	paracetamol := Medicine{
		Name: "paracetamol",
	}
	db.Model(&Medicine{}).Create(&paracetamol)

	lanolin := Medicine{
		Name: "lanolin",
	}
	db.Model(&Medicine{}).Create(&lanolin)

 
	//company
	neocosmed := Company{
		Name: "neocosmed",
	}
	db.Model(&Company{}).Create(&neocosmed)

	Greater_Pharma := Company{
		Name: "Greater Pharma",
	}
	db.Model(&Company{}).Create(&Greater_Pharma)

	//หน่วย
	tube := Unit{
		Name: "หลอด",
	}
	db.Model(&Unit{}).Create(&tube)

	bottle := Unit{
		Name: "ขวด",
	}
	db.Model(&Unit{}).Create(&bottle)

	order1 := Order{
	Quantity:		50,	
	Priceperunit:	100,
	Datetime:	time.Now(),	

	Pharmacist: 	pharmacist4,
	Medicine:	paracetamol,
	Company:	neocosmed,
	Unit:		bottle,
	}
	db.Model(&Order{}).Create(&order1)

	//ระบบจัดยา
	medicinearrangement1 := MedicineArrangement{
		MedicineArrangementNo: 200000,
		Pharmacist: pharmacist2,
		Note: "*มีการเปลี่ยนแปลงยี้ห้อยา",
		MedicineArrangementTime: time.Now(),
	 }
	 db.Model(&MedicineArrangement{}).Create(&medicinearrangement1)
}