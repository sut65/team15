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
		&Zonee{},
		&Floor{},
		&Prescription{},
		&Patient{},
		&Attendance{},
		&Shift{},
		&Statt{},
		&Staff{},
		&Return{},
		&Paymentmethod{},
		&Bill{},
		&Cause{},
		&Discardmedicine{},
		&Staff{},
		&Return{},
		&Reason{},
		&MedicineDisbursement{},
		&MedicineRoom{},
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

	//-------------------------------------------------------------ระบบบันทึกการจัดซื้อยา-------------------------------------------
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
		Ordernumber: "A1001",
		Quantity:     50,
		Priceperunit: 100,
		Datetime:     time.Now(),

		Pharmacist: pharmacist4,
		Medicine:   paracetamol,
		Company:    neocosmed,
		Unit:       bottle,
	}
	db.Model(&Order{}).Create(&order1)

	//-------------------------------------------------------------ระบบบันทึกฉลากยา-------------------------------------------
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

	// --- MedicineLabel Data
	medicinelabel01 := MedicineLabel{
		Order:       order1,
		Suggestion:  sug1,
		Effect:      effect1,
		Instruction: "ก่อนอาหาร",
		Property:    "แก้ไอ",
		Consumption: 1,
		Pharmacist:  pharmacist1,
		Date:        time.Now(),
	}
	db.Model(&MedicineLabel{}).Create(&medicinelabel01)

	//-----------------------------------------------------------ระบบบันทึกคลังยา------------------------------------------
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
		MedicineReceiveNo: "B25430",
		Pharmacist:        pharmacist3,
		Zone:              Zone1,
		RecievedDate:      time.Now(),
		MedicineLabel:     medicinelabel01,
	}
	db.Model(&MedicineReceive{}).Create(&medicineReceive)

	//---------------------------------------------------------ระบบบันทึกการคืนยา--------------------------------------------

	Cause1 := Cause{
		Name: "ยาหมดสภาพ",
	}
	db.Model(&Cause{}).Create(&Cause1)

	Cause2 := Cause{
		Name: "ยาหมดอายุ",
	}
	db.Model(&Cause{}).Create(&Cause2)

	discard1 := Discardmedicine{
		Quantity: 10,
		Cause:    Cause1,
		Note:     "ยาหก",
		Datetime: time.Now(),

		MedicineReceive: medicineReceive,
		Pharmacist:      pharmacist4,
	}
	db.Model(&Discardmedicine{}).Create(&discard1)

	//------------------------------------------------------------ระบบบันทึกการเบิกยา-------------------------------------
	//MedicineRoom
	medicineRoom1 := MedicineRoom{
		MRname: "ยาสำหรับผู้ป่วยนอก",
	}
	db.Model(&MedicineRoom{}).Create(&medicineRoom1)

	medicineRoom2 := MedicineRoom{
		MRname: "ยาสำหรับผู้ป่วยใน",
	}
	db.Model(&MedicineRoom{}).Create(&medicineRoom2)

	//ระบบเบิกยา
	medicineDisbursement01 := MedicineDisbursement{
		MedicineDisNo:     "C205",
		Pharmacist:        pharmacist3,
		MedicineRoom:      medicineRoom1,
		MedicineDisAmount: 10,
		Dtime:             time.Now(),
		MedicineReceive:   medicineReceive,
	}
	db.Model(&MedicineDisbursement{}).Create(&medicineDisbursement01)

	//------------------------------------------------------------ระบบบันทึกการจัดชั้นยา-------------------------------------
	//ตู้ยา
	cupboard1 := Cupboard{
		Name: "A",
	}
	db.Model(&Cupboard{}).Create(&cupboard1)
	cupboard2 := Cupboard{
		Name: "B",
	}
	db.Model(&Cupboard{}).Create(&cupboard2)

	//โซนยา
	zonee1 := Zonee{
		Name: "AA",
	}
	db.Model(&Zonee{}).Create(&zonee1)
	zonee2 := Zonee{
		Name: "BB",
	}
	db.Model(&Zonee{}).Create(&zonee2)

	//ชั้นยา
	floor1 := Floor{
		Number: 1,
	}
	db.Model(&Floor{}).Create(&floor1)
	floor2 := Floor{
		Number: 2,
	}
	db.Model(&Floor{}).Create(&floor2)

	class1 := ClassifyDrugs{
		Pharmacist:           pharmacist6,
		Cupboard:             cupboard2,
		Zonee:                zonee2,
		Floor:                floor2,
		Number:               30001,
		Note:                 "-",
		MedicineDisbursement: medicineDisbursement01,
		Datetime:             time.Now(),
	}
	db.Model(&ClassifyDrugs{}).Create(&class1)

	class2 := ClassifyDrugs{
		Pharmacist:           pharmacist6,
		Cupboard:             cupboard1,
		Zonee:                zonee1,
		Floor:                floor1,
		Number:               30002,
		Note:                 "-",
		MedicineDisbursement: medicineDisbursement01,
		Datetime:             time.Now(),
	}
	db.Model(&ClassifyDrugs{}).Create(&class2)

	//-----------------------------------------------------------ระบบบันทึกการสั่งยา-----------------------------------
	//ผู้ป่วย
	patient1 := Patient{
		Name: "กอไก่ ว่องไว",
		Sex:  "men",
		Age:  21,
	}
	db.Model(&Patient{}).Create(&patient1)
	patient2 := Patient{
		Name: "ขอใข่ ช้าจัง",
		Sex:  "men",
		Age:  22,
	}
	db.Model(&Patient{}).Create(&patient2)

	prescription1 := Prescription{
		Doctor:        doctor,
		Patient:       patient2,
		Number:        10001,
		Note:          "-",
		MedicineLabel: medicinelabel01,
		Datetime:      time.Now(),
	}
	db.Model(&Prescription{}).Create(&prescription1)

	prescription2 := Prescription{
		Doctor:        doctor,
		Patient:       patient1,
		Number:        10002,
		Note:          "-",
		MedicineLabel: medicinelabel01,
		Datetime:      time.Now(),
	}
	db.Model(&Prescription{}).Create(&prescription2)
	//-----------------------------------------------------------ระบบบันทึกการจัดยา------------------------------------------
	medicinearrangement1 := MedicineArrangement{
		MedicineArrangementNo:   200000,
		Prescription:            prescription1,
		ClassifyDrugs:           class1,
		Pharmacist:              pharmacist2,
		Note:                    "*มีการเปลี่ยนแปลงยี่ห้อยา",
		MedicineArrangementTime: time.Now(),
	}
	db.Model(&MedicineArrangement{}).Create(&medicinearrangement1)

	//-----------------------------------------------------------ระบบบันทึกการชำระเงิน---------------------------------------
	//Pay รูปแบบการชำระเงิน
	pay1 := Paymentmethod{
		Name: "ชำระด้วยเงินสด",
	}
	db.Model(&Paymentmethod{}).Create(&pay1)

	pay2 := Paymentmethod{
		Name: "โอนพร้อมเพย์",
	}
	db.Model(&Paymentmethod{}).Create(&pay2)

	// Bill
	bill1 := Bill{
		// BillNo:   1000,
		BillTime: time.Date(2022, 2, 15, 2, 0, 0, 0, time.UTC),
		Payer:    "AWESOME08",
		Total:    6 * 980,
		BillNo:   10000,

		Pharmacist:    pharmacist5,
		Prescription:  prescription1,
		Paymentmethod: pay1,
	}
	db.Model(&Bill{}).Create(&bill1)

	//-----------------------------------------------------ระบบบันทึกการจ่ายยา-------------------------------------
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
		Bill:         bill1,
		ReceiveName:  "แสนดี มากมาย",
		Pharmacy:     pharmacy1,
		Pharmacist:   pharmacist2,
		DispenseTime: time.Now(),
	}
	db.Model(&DispenseMedicine{}).Create(&dispensemedicine)

	//------------------------------------------------------------ระบบบันทึกการคืนยา-------------------------------------

	//-------ระบบบันทึกการคืนยา-------------
	//Staff
	stff1 := Staff{
		StaffName: "Mana Manee",
	}
	db.Model(&Staff{}).Create(&stff1)

	stff2 := Staff{
		StaffName: "Pithi Chujai",
	}
	db.Model(&Staff{}).Create(&stff2)

	//Reason
	Reason1 := Reason{
		ReasonName: "หมดอายุ",
	}
	db.Model(&Reason{}).Create(&Reason1)

	Reason2 := Reason{
		ReasonName: "รับประทานไม่หมด",
	}
	db.Model(&Reason{}).Create(&Reason2)

	// --- MedicineLabel Data
	Return1 := Return{
		MedicineReturnNo:   500000,
		DispenseMedicine: dispensemedicine,
		Order:            order1,
		Staff:            stff1,
		Reason:           Reason1,
		Note:             "ยามีความชื้น",
		Pharmacist:       pharmacist1,
		ReturnDate:       time.Now(),
	}
	db.Model(&Return{}).Create(&Return1)

	//-------------------------------------------------------------ระบบบันทึกการเข้าเวรใหม่-------------------------------------------

	//statt
	statt1 := Statt{
		Name: "จัดสรรยา",
	}
	db.Model(&Statt{}).Create(&statt1)

	statt2 := Statt{
		Name: "การเงิน",
	}
	db.Model(&Statt{}).Create(&statt2)

	//หน่วย
	shift1 := Shift{
		Name: "9.00 - 16.00 น.",
	}
	db.Model(&Shift{}).Create(&shift1)

	shift2 := Shift{
		Name: "16.00 - 0.00 น.",
	}
	db.Model(&Shift{}).Create(&shift2)
	shift3 := Shift{
		Name: "0.00 - 9.00 น.",
	}
	db.Model(&Shift{}).Create(&shift3)

	attendance1 := Attendance{
		Phone:       "0999999999",
		Description: 2,
		Datetime:    time.Now(),

		Pharmacist: pharmacist4,
		Statt:      statt1,
		Shift:      shift1,
	}
	db.Model(&Attendance{}).Create(&attendance1)
}
