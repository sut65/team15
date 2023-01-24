package main

import (
	"github.com/sut65/team15/controller"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())
	//role
	r.GET("/roles", controller.ListRole)

	// User
	r.GET("/users", controller.ListUser)
	r.POST("/user", controller.CreateUser)
	r.GET("/users/:id", controller.GetUser)
	
	//------------------------------------------ระบบย่อย ระบบบันทึกการสั่งซื้อยา--------------------------
	//medicine
	r.GET("/medicines",controller.ListMedicine)

	//company
	r.GET("/companys",controller.ListCompany)

	//Unit
	r.GET("/units",controller.ListUnit)

	//Order
	r.POST("order",controller.CreateOrder)
	r.GET("/orders",controller.ListOrder)
	r.GET("/order/:id",controller.GetOrder)
	r.PATCH("/order",controller.UpdateOrder)

	//-----------------------------------ระบบย่อย ระบบบันทึกฉลากยา---------------------------------------


	//-----------------------------------ระบบย่อย ระบบบันทึกคลังยา----------------------------------------


	//-----------------------------------ระบบย่อย ระบบบันทึกการทิ้งยา--------------------------------------


	//-----------------------------------ระบบย่อย ระบบบันทึกการเบิกยา-------------------------------------


	//-----------------------------------ระบบย่อย ระบบบันทึกการจัดชั้นยา------------------------------------


	//-----------------------------------ระบบย่อย ระบบบันทึกการสั่งยา--------------------------------------


	//-------------------------------ระบบย่อย ระบบบันทึกการจัดยา--------------------------------------
	//MedicineArrangement
	r.POST("/medicinearrangement",controller.CreateMedicineArrangement)
	r.GET("/medicinearrangements",controller.ListMedicineArrangement)
	r.GET("/medicinearrangements/:id",controller.GetMedicineArrangement)
	r.PATCH("/medicinearrangements",controller.UpdateMedicineArrangement)
	r.DELETE("/medicinearrangements/:id",controller.DeleteMedicineArrangement)

	//-------------------------------------ระบบย่อย ระบบบันทึกการชำระเงิน--------------------------------



	//--------------------------------ระบบย่อย ระบบบันทึกการจ่ายยา------------------------------------
	//Pharmacy
	r.GET("/pharmacys",controller.ListPharmacy)
	
	//DispenseMedicine
	r.POST("/dispensemedicine",controller.CreateDispenseMedicine)
	r.GET("/dispensemedicines",controller.ListDispenseMedicine)
	r.GET("/dispensemedicines/:id",controller.GetMedicineArrangement)
	r.PATCH("/dispensemedicines",controller.UpdateDispenseMedicine)
	r.DELETE("/dispensemedicines/:id",controller.DeleteDispenseMedicine)
	

	//----------------------------------ระบบย่อย ระบบบันทึกการคืนยา-----------------------------------

	
	//-----------------------------------ระบบย่อย ระบบบันทึกการเข้าเวร---------------------------------


	// Run the server

	r.Run()

}
func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
  
		  c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		  c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		  c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		  c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
  
   
  
		  if c.Request.Method == "OPTIONS" {
  
			c.AbortWithStatus(204)
  
			return
  
		  }
  
   
  
		  c.Next()
  
	}
  
  }
  
   