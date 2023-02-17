package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /cases
func CreateBill(c *gin.Context) {

	var bills entity.Bill
	var prescriptions entity.Prescription
	var paymentmethods entity.Paymentmethod
	var pharmacist entity.User //var authority entity.Authorities

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 7 จะถูก bind เข้าตัวแปร bill
	if err := c.ShouldBindJSON(&bills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 8: ค้นหา Prescription ด้วย id
	if tx := entity.DB().Where("id = ?", bills.PrescriptionID).First(&prescriptions); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription not found"})
		return
	}

	//9: ค้นหา paymentmethod ด้วย id
	if tx := entity.DB().Where("id = ?", bills.PaymentmethodID).First(&paymentmethods); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymentmethods 1 not found"})
		return
	}

	// 10: ค้นหา informer ด้วย id
	if tx := entity.DB().Where("id = ?", bills.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)

	// 11: สร้าง Bill   //พิมใหญ่= หลัก //พิมเล็กs = รอง
	bi := entity.Bill{
		Prescription:  prescriptions,  // โยงความสัมพันธ์กับ Entity Prescription
		Paymentmethod: paymentmethods, // โยงความสัมพันธ์กับ Entity Paymentmethod
		Pharmacist:    pharmacist,     // โยงความสัมพันธ์กับ Entity Pharmacist

		BillTime: bills.BillTime, // ตั้งค่าฟิลด์ BillTime
		Payer:    bills.Payer,    // ตั้งค่าฟิลด์ Payer
		Total:    bills.Total,    // ตั้งค่าฟิลด์ Total
		BillNo:   bills.BillNo,   // ตั้งค่าฟิลด์ Total
	}

	// validate Bill controller
	if _, err := govalidator.ValidateStruct(bi); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 12: บันทึก
	if err := entity.DB().Create(&bi).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bi})

}

// GET /bill/:id
func GetBill(c *gin.Context) {
	var bill entity.Bill
	id := c.Param("id")
	if err := entity.DB().Preload("Prescription").Preload("Paymentmethod").
		Preload("Pharmacist").Raw("SELECT * FROM bil_ls WHERE id = ?", id).Find(&bill).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bill})
}

// list /bills
func ListBill(c *gin.Context) {
	var bills []entity.Bill

	if err := entity.DB().Preload("Prescription").Preload("Paymentmethod").
		Preload("Pharmacist").Raw("SELECT * FROM bills").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bills})
}

// DELETE /bills/:id
func DeleteBill(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM bills WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bills not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /bills รอแก้
func UpdateBill(c *gin.Context) {
	var bills entity.Bill
	if err := c.ShouldBindJSON(&bills); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", bills.ID).First(&bills); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bills 2 not found"})
		return
	}

	if err := entity.DB().Save(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}
