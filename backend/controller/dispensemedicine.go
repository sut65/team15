package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Post /dispensemedicine
func CreateDispenseMedicine(c *gin.Context)  {
	var pharmacist entity.User
	var pharmacy entity.Pharmacy
	var dispensemedicine entity.DispenseMedicine
	var bill entity.Bill

	if err := c.ShouldBindJSON(&dispensemedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
		}
	// 9: ค้นหา Bill ด้วย id
	if tx := entity.DB().Where("id = ?", dispensemedicine.BillID).First(&bill); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bill not found"})
		return
	}

	// 10: ค้นหา Pharmacy ด้วย id
	if tx := entity.DB().Where("id = ?", dispensemedicine.PharmacyID).First(&pharmacy); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacy not found"})
		return
	}

	// 11:ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", dispensemedicine.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	// 13: สร้าง DispenseMedicine 
	dispense := entity.DispenseMedicine{
		DispenseNo: 	dispensemedicine.DispenseNo,		
		Bill:			bill,								// โยงความสัมพันธ์กับ Entity Bill
		Pharmacy:   	pharmacy, 							// โยงความสัมพันธ์กับ Entity Pharmacy
		Pharmacist: 	pharmacist,       					// โยงความสัมพันธ์กับ Entity User
		ReceiveName:	dispensemedicine.ReceiveName,
		DispenseTime:	dispensemedicine.DispenseTime, 		// ตั้งค่าฟิลด์ watchedTime
	}

	if _, err := govalidator.ValidateStruct(dispense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 14: บันทึก
	if err := entity.DB().Create(&dispense).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispense})

}

// GET /dispensemedicines/:id
func GetDispenseMedicine(c *gin.Context) {
	var dispensemedicines entity.DispenseMedicine
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Pharmacy").Preload("Bill").Raw("SELECT * FROM dispense_medicines WHERE id = ?", id).Find(&dispensemedicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": dispensemedicines})
}

// GET /dispensemedicines
func ListDispenseMedicine(c *gin.Context) {
	var dispensemedicines []entity.DispenseMedicine
	if err := entity.DB().Preload("Pharmacist").Preload("Pharmacy").Preload("Bill").Raw("SELECT * FROM dispense_medicines").Find(&dispensemedicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dispensemedicines})
}

// DELETE /dispensemedicines/:id
func DeleteDispenseMedicine(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM dispense_medicines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dispensemedicines not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /dispensemedicines
func UpdateDispenseMedicine(c *gin.Context) {
	var pharmacist entity.User
	var pharmacy entity.Pharmacy
	var dispensemedicine entity.DispenseMedicine
	var bill entity.Bill

	if err := c.ShouldBindJSON(&dispensemedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", dispensemedicine.BillID).First(&bill); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bill_id not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", dispensemedicine.PharmacyID).First(&pharmacy); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacy_id not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", dispensemedicine.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist_id not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	updatedispense := entity.DispenseMedicine{
		DispenseNo: 	dispensemedicine.DispenseNo,		
		Bill:			dispensemedicine.Bill,								
		Pharmacy:   	dispensemedicine.Pharmacy, 							
		Pharmacist: 	dispensemedicine.Pharmacist,       					
		ReceiveName:	dispensemedicine.ReceiveName,
		DispenseTime:	dispensemedicine.DispenseTime, 		
	}

	if _, err := govalidator.ValidateStruct(updatedispense); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", dispensemedicine.ID).Updates(&dispensemedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": updatedispense})
}