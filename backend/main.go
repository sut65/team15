package main

import (
	"github.com/sut65/team15/controller"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"github.com/sut65/team15/middlewares"
)

func main() {

	entity.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes()) //บล็อคการดึงข้อมูล
		{
			//------------------------------------------ระบบย่อย ระบบบันทึกการสั่งซื้อยา--------------------------
			//medicine
			
			protected.GET("/medicines", controller.ListMedicine)

			//company
			protected.GET("/companys", controller.ListCompany)

			//Unit
			protected.GET("/units", controller.ListUnit)

			//Order
			protected.POST("/order", controller.CreateOrder)
			protected.GET("/orders", controller.ListOrder)
			protected.GET("/order/:id", controller.GetOrder)
			protected.PATCH("/order", controller.UpdateOrder)
			protected.DELETE("/order/:id", controller.DeleteOrder)

			//-----------------------------------ระบบย่อย ระบบบันทึกฉลากยา---------------------------------------
			//MedicineLabels Routes
			protected.GET("/medicineLabels", controller.ListMedicineLabel)
			protected.GET("/medicineLabel/:id", controller.GetMedicineLabel)
			protected.POST("/medicineLabels", controller.CreateMedicineLabel)
			protected.PATCH("/medicineLabels", controller.UpdateMedicineLabel)
			protected.DELETE("/medicineLabels/:id", controller.DeleteMedicineLabel)

			// Suggestion Routes
			protected.GET("/suggestions", controller.ListSuggestion)
			protected.GET("/suggestion/:id", controller.GetSuggestion)
			protected.POST("/suggestions", controller.CreateSuggestion)
			protected.PATCH("/suggestions", controller.UpdateSuggestion)
			protected.DELETE("/suggestions/:id", controller.DeleteSuggestion)

			// Effect Routes
			r.GET("/effects", controller.ListEffect)
			r.GET("/effect/:id", controller.GetEffect)
			r.POST("/effects", controller.CreateEffect)
			r.PATCH("/effects", controller.UpdateEffect)
			r.DELETE("/effects/:id", controller.DeleteEffect)
			//-----------------------------------ระบบย่อย ระบบบันทึกคลังยา----------------------------------------
			protected.POST("/medicineReceives", controller.CreatemedicineReceive)
			protected.GET("/medicineReceive", controller.ListMedicineReceive)
			protected.GET("/medicineReceive/:id", controller.GetMedicineReceive)
			protected.PATCH("/medicineReceive", controller.UpdateMedicineReceive)
			protected.DELETE("/medicineReceives/:id", controller.DeleteMedicineReceive)
			//Zone
			protected.GET("/Zones", controller.ListZone)

			//-----------------------------------ระบบย่อย ระบบบันทึกการทิ้งยา--------------------------------------

			protected.GET("/causes", controller.ListCause)
			protected.POST("/discardmedicine", controller.CreateDiscardmedicine)
			protected.GET("/discardmedicine/:id", controller.Discardmedicine)
			protected.GET("/discardmedicine", controller.ListDiscardmedicine)
			protected.PATCH("/discardmedicine", controller.UpdateDiscardmedicine)
			protected.DELETE("/discardmedicine/:id", controller.DeleteDiscardmedicine)

			//-----------------------------------ระบบย่อย ระบบบันทึกการเบิกยา-------------------------------------

			protected.POST("/medicineDisbursements", controller.CreatemedicineDisbursement)
			protected.GET("/medicineDisbursement", controller.ListMedicineDisbursement)
			protected.GET("/medicineDisbursement/:id", controller.GetMedicineDisbursement)
			protected.PATCH("/medicineDisbursement", controller.UpdateMedicineDisbursement)
			protected.DELETE("/medicineDisbursements/:id", controller.DeleteMedicineDisbursement)
			//MedicineRoom
			protected.GET("/MedicineRooms", controller.ListMedicineRoom)

			//-----------------------------------ระบบย่อย ระบบบันทึกการจัดชั้นยา------------------------------------
			//Cupboard
			protected.GET("/Cupboard", controller.ListCupboard)
			//Zonee
			protected.GET("/Zonee", controller.ListZonee)
			//Floor
			protected.GET("/Floor", controller.ListFloor)
			//ClassifyDrug
			protected.POST("ClassifyDrugs", controller.CreateClassifyDrugs)
			protected.GET("/ClassifyDrug", controller.ListClassifyDrug)
			protected.GET("/ClassifyDrug/:id", controller.GetClassifyDrug)
			protected.PATCH("/ClassifyDrug", controller.UpdateClassifyDrug)
			protected.GET("/classifydrugs/:id", controller.GetClassifyDrug)
			protected.DELETE("/classifydrugs/:id", controller.DeleteClassifyDrug)

			//-----------------------------------ระบบย่อย ระบบบันทึกการสั่งยา--------------------------------------
			//Patient
			protected.GET("/Patient", controller.ListPatient)

			//Prescription
			protected.POST("Prescription", controller.CreatePrescription)
			protected.GET("/Prescriptions", controller.ListPrescription)
			protected.GET("/Prescription/:id", controller.GetPrescription)
			protected.PATCH("/Prescription", controller.UpdatePrescription)
			protected.GET("/prescription/:id", controller.GetPrescription)
			protected.DELETE("/prescription/:id", controller.DeletePrescription)

			//-------------------------------ระบบย่อย ระบบบันทึกการจัดยา--------------------------------------
			//MedicineArrangement
			protected.POST("/medicinearrangement", controller.CreateMedicineArrangement)
			protected.GET("/medicinearrangements", controller.ListMedicineArrangement)
			protected.GET("/medicinearrangements/:id", controller.GetMedicineArrangement)
			protected.PATCH("/medicinearrangements", controller.UpdateMedicineArrangement)
			protected.DELETE("/medicinearrangements/:id", controller.DeleteMedicineArrangement)

			//-------------------------------------ระบบย่อย ระบบบันทึกการชำระเงิน--------------------------------
			//Paymentmethod Routes
			protected.GET("/paymentmethods", controller.ListPaymentmethod)
			protected.GET("/paymentmethod/:id", controller.GetPaymentmethod)
			protected.POST("/paymentmethods", controller.CreatePaymentmethod)
			protected.PATCH("/paymentmethods", controller.UpdatePaymentmethod)
			protected.DELETE("/paymentmethods/:id", controller.DeletePaymentmethod)

			//Bill Routes
			protected.GET("/bills", controller.ListBill)
			protected.GET("/bill/:id", controller.GetBill)
			protected.POST("/bills", controller.CreateBill)
			protected.PATCH("/bills", controller.UpdateBill)
			protected.DELETE("/bills/:id", controller.DeleteBill)

			//--------------------------------ระบบย่อย ระบบบันทึกการจ่ายยา------------------------------------
			//Pharmacy
			protected.GET("/pharmacys", controller.ListPharmacy)

			//DispenseMedicine
			protected.POST("/dispensemedicine", controller.CreateDispenseMedicine)
			protected.GET("/dispensemedicines", controller.ListDispenseMedicine)
			protected.GET("/dispensemedicines/:id", controller.GetDispenseMedicine)
			protected.PATCH("/dispensemedicines", controller.UpdateDispenseMedicine)
			protected.DELETE("/dispensemedicines/:id", controller.DeleteDispenseMedicine)

			//----------------------------------ระบบย่อย ระบบบันทึกการคืนยา-----------------------------------

			protected.POST("/medicinereturns", controller.CreateMedicineReturn)
			protected.GET("/medicinereturns", controller.ListMedicineReturn)
			protected.GET("/medicinereturn/:id", controller.GetMedicineReturn)
			protected.PATCH("/medicinereturns", controller.UpdateMedicineReturn)
			protected.DELETE("/medicinereturns/:id", controller.DeleteMedicineReturn)

			protected.GET("/staffs", controller.ListStaffs)
			protected.GET("/staff/:id", controller.GetStaff)
			protected.POST("/staffs", controller.CreateStaff)
			protected.PATCH("/staffs", controller.UpdateStaff)
			protected.DELETE("/staffs/:id", controller.DeleteStaff)

			protected.POST("/reasons", controller.CreateReason)
			protected.GET("/reasons", controller.ListReason)
			protected.GET("/reason/:id", controller.GetReason)
			protected.PATCH("/reasons", controller.UpdateReason)
			protected.DELETE("/reasons/:id", controller.DeleteReason)

			//------------------------------------------ระบบย่อย ระบบบันทึกการเข้าเวร--------------------------

			//statts
			protected.GET("/statts", controller.ListStatt)

			//shifts
			protected.GET("/shifts", controller.ListShift)

			//attendance
			protected.POST("/attendance", controller.CreateAttendance)
			protected.GET("/attendances", controller.ListAttendance)
			protected.GET("/attendance/:id", controller.GetAttendance)
			protected.PATCH("/attendance", controller.UpdateAttendance)
			protected.DELETE("/attendance/:id", controller.DeleteAttendance)

			//role
			protected.GET("/roles", controller.ListRole)
			// User
			protected.GET("/users", controller.ListUser)
			protected.POST("/user", controller.CreateUser)
			protected.GET("/users/:id", controller.GetUser)
		}
	}
	
	//authentication
	r.POST("/login", controller.Login)
	
	// Run the server

	r.Run()

}
func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT, PATCH")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
