package entity

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
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
		&MedicineLabel{},
		&Suggestion{},
		&Effect{},
		&Order{},
		&MedicineArrangement{},
		&Pharmacy{},
		&DispenseMedicine{},
		&Zone{},
		&MedicineReceive{},
		&ClassifyDrugs{},
		&Cupboard{},
		&Prescription{},
		&Patient{},
		&Attendance{},
		&Shift{},
		&Stat{},
		&Staff{},
		&Return{},
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
		Name:     "sirinthip",
		UserName: "B6221126",
		Password: string(password2),
		Role:     role2,
	}
	db.Model(&User{}).Create(&doctor)

	pharmacist1 := User{
		Name:     "warangkana",
		UserName: "B6201562",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist1)

	pharmacist2 := User{
		Name:     "supaporn",
		UserName: "B6216948",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist2)

	pharmacist3 := User{
		Name:     "jirawat",
		UserName: "B6221928",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist3)

	pharmacist4 := User{
		Name:     "woottikrai",
		UserName: "B6224356",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist4)
	pharmacist5 := User{
		Name:     "nawamin",
		UserName: "B6226916",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist5)

	pharmacist6 := User{
		Name:     "kotthip",
		UserName: "B6221111",
		Password: string(password1),
		Role:     role1,
	}
	db.Model(&User{}).Create(&pharmacist6)

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
		Quantity:     50,
		Priceperunit: 100,
		Datetime:     time.Now(),

		Pharmacist: pharmacist4,
		Medicine:   paracetamol,
		Company:    neocosmed,
		Unit:       bottle,
	}
	db.Model(&Order{}).Create(&order1)

	//Suggestion
	sug1 := Suggestion{
		SuggestionName: "ใช้ยาจนหมด",
	}
	db.Model(&Suggestion{}).Create(&sug1)

	sug2 := Suggestion{
		SuggestionName: "หยุดใช้เมื่อหาย",
	}
	db.Model(&Suggestion{}).Create(&sug2)

	//Effect
	effect1 := Effect{
		EffectName: "ทานแล้วอาจทำให้ง่วงซึม",
	}
	db.Model(&Effect{}).Create(&effect1)

	effect2 := Effect{
		EffectName: "ทำให้รู้สึกขมคอ",
	}
	db.Model(&Effect{}).Create(&effect2)

	effect3 := Effect{
		EffectName: "ทานแล้วอาจทำให้อาเจียน",
	}
	db.Model(&Effect{}).Create(&effect3)

	effect4 := Effect{
		EffectName: "ทานแล้วอาจทำให้คลื่นไส้",
	}
	db.Model(&Effect{}).Create(&effect4)
	//--------------------ระบบบันทึกฉลากยา-----------------------------
	// --- MedicineLabel Data
	medicinelabel01 := MedicineLabel{
		Order:       order1,
		Suggestion:  sug1,
		Effect:      effect1,
		Instruction: "ก่อนอาหาร",
		Property:    "แก้ไอ",
		Consumption: "1",
		Pharmacist:  pharmacist1,
		Date:        time.Now(),
	}
	db.Model(&MedicineLabel{}).Create(&medicinelabel01)

	//----------------------ระบบจัดชั้นยา--------------------------
	//ตู้ยา
	cupboard1 := Cupboard{
		Name:  "A",
		Zone:  "AA",
		Floor: 2,
	}
	db.Model(&Cupboard{}).Create(&cupboard1)
	cupboard2 := Cupboard{
		Name:  "B",
		Zone:  "BB",
		Floor: 3,
	}
	db.Model(&Cupboard{}).Create(&cupboard2)

	class1 := ClassifyDrugs{
		Pharmacist: pharmacist6,
		Cupboard:   cupboard2,
		Note:       "-",
		Datetime:   time.Now(),
	}
	db.Model(&ClassifyDrugs{}).Create(&class1)

	class2 := ClassifyDrugs{
		Pharmacist: pharmacist6,
		Cupboard:   cupboard1,
		Note:       "-",
		Datetime:   time.Now(),
	}
	db.Model(&ClassifyDrugs{}).Create(&class2)

	//----------------------ระบบสั่งยา--------------------------
	//ผู้ป่วย
	patient1 := Patient{
		FirstName: "A",
		LastName:  "AA",
		Sex:       "men",
		Age:       21,
	}
	db.Model(&Patient{}).Create(&patient1)
	patient2 := Patient{
		FirstName: "B",
		LastName:  "BB",
		Sex:       "men",
		Age:       22,
	}
	db.Model(&Patient{}).Create(&patient2)

	prescription1 := Prescription{
		Doctor:   doctor,
		Patient:  patient2,
		Number:   10001,
		Note:     "-",
		Datetime: time.Now(),
	}
	db.Model(&Prescription{}).Create(&prescription1)

	prescription2 := Prescription{
		Doctor:   doctor,
		Patient:  patient1,
		Number:   10002,
		Note:     "-",
		Datetime: time.Now(),
	}
	db.Model(&Prescription{}).Create(&prescription2)

	//-------------------------------------ระบบจัดยา---------------------
	medicinearrangement1 := MedicineArrangement{
		MedicineArrangementNo:   200000,
		Prescription:            prescription1,
		ClassifyDrugs:           class1,
		Pharmacist:              pharmacist2,
		Note:                    "*มีการเปลี่ยนแปลงยี้ห้อยา",
		MedicineArrangementTime: time.Now(),
	}
	db.Model(&MedicineArrangement{}).Create(&medicinearrangement1)

	//ช่องจ่ายยา
	pharmacy1 := Pharmacy{
		PharmacyBox: 1,
	}
	db.Model(&Pharmacy{}).Create(&pharmacy1)
	pharmacy2 := Pharmacy{
		PharmacyBox: 2,
	}
	db.Model(&Pharmacy{}).Create(&pharmacy2)
	pharmacy3 := Pharmacy{
		PharmacyBox: 3,
	}
	db.Model(&Pharmacy{}).Create(&pharmacy3)
	//ระบบจ่ายยา
	dispensemedicine := DispenseMedicine{
		DispenseNo:   100000,
		ReceiveName:  "แสนดี มากมาย",
		Pharmacy:     pharmacy1,
		Pharmacist:   pharmacist2,
		DispenseTime: time.Now(),
	}
	db.Model(&DispenseMedicine{}).Create(&dispensemedicine)

	//Zone
	Zone1 := Zone{
		ZoneName: "A",
	}
	db.Model(&Zone{}).Create(&Zone1)

	Zone2 := Zone{
		ZoneName: "B",
	}
	db.Model(&Zone{}).Create(&Zone2)

	Zone3 := Zone{
		ZoneName: "C",
	}
	db.Model(&Zone{}).Create(&Zone3)

	//ระบบคลังยา
	medicineReceive := MedicineReceive{
		MedicineReceiveNo: 0111,
		Pharmacist:        pharmacist2,
		Zone:              Zone1,
		RecievedDate:      time.Now(),
		//MedicineLabel:     MedicineLabel,
	}
	db.Model(&MedicineReceive{}).Create(&medicineReceive)

	//ช่วงเข้าเวร
	morning := Shift{
		Name: "9.00 - 16.00 น.",
	}
	db.Model(&Shift{}).Create(&morning)

	evening := Shift{
		Name: "16.00 - 0.00 น.",
	}
	db.Model(&Shift{}).Create(&evening)
	night := Shift{
		Name: "0.00 - 9.00 น.",
	}
	db.Model(&Shift{}).Create(&night)

	//หน้าที่
	m1 := Stat{
		Name: "จัดสรรยา",
	}
	db.Model(&Stat{}).Create(&m1)

	m2 := Stat{
		Name: "การเงิน",
	}
	db.Model(&Stat{}).Create(&m2)

	attendance1 := Attendance{
		Phone:       "09999",
		Description: "เกือบไม่ได้มา",
		Datetime:    time.Now(),

		Pharmacist: pharmacist4,
		Shift:      night,
		Stat:       m2,
	}
	db.Model(&Attendance{}).Create(&attendance1)

	//-------ระบบบันทึกการคืนยา-------------

}
