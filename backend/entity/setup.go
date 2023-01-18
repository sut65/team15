package entity

 

import (

           "gorm.io/gorm"

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
	 database.AutoMigrate()

 

	 db = database
}