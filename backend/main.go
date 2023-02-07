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

	//authentication
	r.POST("/login", controller.Login)
	// User
	r.GET("/users", controller.ListUser)
	r.POST("/user", controller.CreateUser)
	r.GET("/users/:id", controller.GetUser)

	//------------------------------------------ระบบย่อย ระบบบันทึกการสั่งซื้อยา--------------------------
	//medicine
	r.GET("/medicines", controller.ListMedicine)

	//company
	r.GET("/companys", controller.ListCompany)

	//Unit
	r.GET("/units", controller.ListUnit)

	//Order
	r.POST("/order", controller.CreateOrder)
	r.GET("/orders", controller.ListOrder)
	r.GET("/order/:id", controller.GetOrder)
	r.PATCH("/order", controller.UpdateOrder)
	r.DELETE("/order/:id", controller.DeleteOrder)

	//-----------------------------------ระบบย่อย ระบบบันทึกฉลากยา---------------------------------------
	//MedicineLabels Routes
	r.GET("/medicineLabels", controller.ListMedicineLabel)
	r.GET("/medicineLabel/:id", controller.GetMedicineLabel)
	r.POST("/medicineLabels", controller.CreateMedicineLabel)
	r.PATCH("/medicineLabels", controller.UpdateMedicineLabel)
	r.DELETE("/medicineLabels/:id", controller.DeleteMedicineLabel)

	// Suggestion Routes
	r.GET("/suggestions", controller.ListSuggestion)
	r.GET("/suggestion/:id", controller.GetSuggestion)
	r.POST("/suggestions", controller.CreateSuggestion)
	r.PATCH("/suggestions", controller.UpdateSuggestion)
	r.DELETE("/suggestions/:id", controller.DeleteSuggestion)

	// Effect Routes
	r.GET("/effects", controller.ListEffect)
	r.GET("/effect/:id", controller.GetEffect)
	r.POST("/effects", controller.CreateEffect)
	r.PATCH("/effects", controller.UpdateEffect)
	r.DELETE("/effects/:id", controller.DeleteEffect)
	//-----------------------------------ระบบย่อย ระบบบันทึกคลังยา----------------------------------------
	r.POST("/medicineReceives", controller.CreatemedicineReceive)
	r.GET("/medicineReceive", controller.ListMedicineReceive)
	r.GET("/medicineReceive/:id", controller.GetMedicineReceive)
	r.PATCH("/medicineReceive", controller.UpdateMedicineReceive)

	//Zone
	r.GET("/Zones", controller.ListZone)

	//-----------------------------------ระบบย่อย ระบบบันทึกการทิ้งยา--------------------------------------

	r.GET("/causes", controller.ListCause)

	r.GET("/discardmedicine/:id", controller.Discardmedicine)
	r.GET("/discardmedicine", controller.ListDiscardmedicine)
	r.PATCH("/discardmedicine", controller.UpdateDiscardmedicine)
	r.DELETE("/discardmedicine/:id", controller.DeleteDiscardmedicine)

	//-----------------------------------ระบบย่อย ระบบบันทึกการเบิกยา-------------------------------------

	//-----------------------------------ระบบย่อย ระบบบันทึกการจัดชั้นยา------------------------------------
	//Cupboard
	r.GET("/Cupboard", controller.ListCupboard)
	//Zonee
	r.GET("/Zonee", controller.ListZonee)
	//Floor
	r.GET("/Floor", controller.ListFloor)
	//ClassifyDrug
	r.POST("ClassifyDrugs", controller.CreateClassifyDrugs)
	r.GET("/ClassifyDrug", controller.ListClassifyDrug)
	r.GET("/ClassifyDrug/:id", controller.GetClassifyDrug)
	r.PATCH("/ClassifyDrug", controller.UpdateClassifyDrug)

	//-----------------------------------ระบบย่อย ระบบบันทึกการสั่งยา--------------------------------------
	//Patient
	r.GET("/Patient", controller.ListPatient)

	//Prescription
	r.POST("Prescription", controller.CreatePrescription)
	r.GET("/Prescriptions", controller.ListPrescription)
	r.GET("/Prescription/:id", controller.GetPrescription)
	r.PATCH("/Prescription", controller.UpdatePrescription)

	//-----------------------------------ระบบย่อย ระบบบันทึกการสั่งยา--------------------------------------

	//-------------------------------ระบบย่อย ระบบบันทึกการจัดยา--------------------------------------
	//MedicineArrangement
	r.POST("/medicinearrangement", controller.CreateMedicineArrangement)
	r.GET("/medicinearrangements", controller.ListMedicineArrangement)
	r.GET("/medicinearrangements/:id", controller.GetMedicineArrangement)
	r.PATCH("/medicinearrangements", controller.UpdateMedicineArrangement)
	r.DELETE("/medicinearrangements/:id", controller.DeleteMedicineArrangement)

	//-------------------------------------ระบบย่อย ระบบบันทึกการชำระเงิน--------------------------------
	//Paymentmethod Routes
	r.GET("/paymentmethods", controller.ListPaymentmethod)
	r.GET("/paymentmethod/:id", controller.GetPaymentmethod)
	r.POST("/paymentmethods", controller.CreatePaymentmethod)
	r.PATCH("/paymentmethods", controller.UpdatePaymentmethod)
	r.DELETE("/paymentmethods/:id", controller.DeletePaymentmethod)

	//Bill Routes
	r.GET("/bills", controller.ListBill)
	r.GET("/bill/:id", controller.GetBill)
	r.POST("/bills", controller.CreateBill)
	r.PATCH("/bills", controller.UpdateBill)
	r.DELETE("/bills/:id", controller.DeleteBill)
	r.GET("/PrescriptionPaymentStatusNotPaid", controller.ListPrescriptionPaymentStatusNotPaid)
	r.GET("/PrescriptionNo/:id", controller.GetPrescriptionNo)

	//--------------------------------ระบบย่อย ระบบบันทึกการจ่ายยา------------------------------------
	//Pharmacy
	r.GET("/pharmacys", controller.ListPharmacy)

	//DispenseMedicine
	r.POST("/dispensemedicine", controller.CreateDispenseMedicine)
	r.GET("/dispensemedicines", controller.ListDispenseMedicine)
	r.GET("/dispensemedicines/:id", controller.GetMedicineArrangement)
	r.PATCH("/dispensemedicines", controller.UpdateDispenseMedicine)
	r.DELETE("/dispensemedicines/:id", controller.DeleteDispenseMedicine)

	//----------------------------------ระบบย่อย ระบบบันทึกการคืนยา-----------------------------------

	r.POST("/medicinereturns",controller.CreateMedicineReturn)
	r.GET("/medicinereturns",controller.ListMedicineReturn)
	r.GET("/medicinereturn/:id",controller.GetMedicineReturn)
	r.PATCH("/medicinereturns",controller.UpdateMedicineReturn)
	r.DELETE("/medicinereturns/:id",controller.DeleteMedicineReturn)



	r.GET("/staffs", controller.ListStaffs)
	r.GET("/staff/:id", controller.GetStaff)
	r.POST("/staffs", controller.CreateStaff)
	r.PATCH("/staffs", controller.UpdateStaff)
	r.DELETE("/staffs/:id", controller.DeleteStaff)

	r.POST("/reasons",controller.CreateReason)
	r.GET("/reasons",controller.ListReason)
	r.GET("/reason/:id",controller.GetReason)
	r.PATCH("/reasons",controller.UpdateReason)
	r.DELETE("/reasons/:id",controller.DeleteReason)
	//-----------------------------------ระบบย่อย ระบบบันทึกการเข้าเวร---------------------------------
	//shift
	r.GET("/shifts", controller.ListShift)

	//Status
	r.GET("/stats", controller.ListStat)

	//Attendance
	r.POST("attendance", controller.CreateAttendance)
	r.GET("/attendances", controller.ListAttendance)
	r.GET("/attendance/:id", controller.GetAttendance)
	r.PATCH("/attendance", controller.UpdateAttendance)

	


	// Run the server

	r.Run()

}
func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, DELETE, PUT")

		if c.Request.Method == "OPTIONS" {

			c.AbortWithStatus(204)

			return

		}

		c.Next()

	}

}
