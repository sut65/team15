package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"
)

// POST /medicineReceives
func CreatemedicineReceive(c *gin.Context) {
	var medicineLabel entity.MedicineLabel
	var medicineReceive entity.MedicineReceive
	var pharmacist entity.User
	var zone entity.Zone

	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&medicineReceive); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 9: ค้นหา zone ด้วย id
	if tx := entity.DB().Where("id = ?", medicineReceive.ZoneID).First(&zone); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}
	// 10: ค้นหา medicineLabel ด้วย id
	if tx := entity.DB().Where("id = ?", medicineReceive.MedicineLabelID).First(&medicineLabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
	//  11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", medicineReceive.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	// 12: สร้าง MedicineReceive
	wv := entity.MedicineReceive{

		RecievedDate:      medicineReceive.RecievedDate,
		Pharmacist:        pharmacist,
		MedicineLabel:     medicineLabel,
		Zone:              zone,
		MedicineReceiveNo: medicineReceive.MedicineReceiveNo,
		
	}
	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 15: บันทึก
	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

// GET /medicineReceive/:id
func GetMedicineReceive(c *gin.Context) {
	var medicineReceive entity.MedicineReceive
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Zone").Preload("MedicineLabel").Preload("MedicineLabel.Order").Preload("MedicineLabel.Order.Medicine").Raw("SELECT * FROM medicine_receives WHERE id = ?", id).Find(&medicineReceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineReceive})
}

// GET /medicineReceive
func ListMedicineReceive(c *gin.Context) {
	var medicineReceive []entity.MedicineReceive
	if err := entity.DB().Preload("Pharmacist").Preload("Zone").Preload("MedicineLabel").Preload("MedicineLabel.Order").Preload("MedicineLabel.Order.Medicine").Preload("MedicineLabel.Order.Unit").Raw("SELECT * FROM medicine_receives").Find(&medicineReceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineReceive})
}

// DELETE /medicineReceive/:id
func DeleteMedicineReceive(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_receives WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicineReceive not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicineReceive
func UpdateMedicineReceive(c *gin.Context) {
	var medicineReceive entity.MedicineReceive
	var zone entity.Zone
	var pharmacist entity.User
	var medicineLabel entity.MedicineLabel



	if err := c.ShouldBindJSON(&medicineReceive); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineReceive.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineReceive.MedicineLabelID).First(&medicineLabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบฉลากยา"})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineReceive.ZoneID).First(&zone); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบโซนยา"})
		return
	}

	update := entity.MedicineReceive{
		RecievedDate:      medicineReceive.RecievedDate,
		Pharmacist:        medicineReceive.Pharmacist,
		MedicineLabel:     medicineReceive.MedicineLabel,
		Zone:              medicineReceive.Zone,
		MedicineReceiveNo: medicineReceive.MedicineReceiveNo,

	}
		// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", medicineReceive.ID).Updates(&medicineReceive).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	
	c.JSON(http.StatusOK, gin.H{"data": update})
}
