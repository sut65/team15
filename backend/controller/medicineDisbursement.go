package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"
)

// POST /medicineDisbursements
func CreatemedicineDisbursement(c *gin.Context) {
	var medicineReceive entity.MedicineReceive
	var medicineDisbursement entity.MedicineDisbursement
	var pharmacist entity.User
	var medicineRoom entity.MedicineRoom

	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&medicineDisbursement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 9: ค้นหา medicineRoom ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineRoomID).First(&medicineRoom); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}
	// 10: ค้นหา MedicineReceive ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineReceiveID).First(&medicineReceive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
	//  11: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}
	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}
	// 12: สร้าง MedicineDisbursement
	wv := entity.MedicineDisbursement{

		Dtime:             medicineDisbursement.Dtime,
		Pharmacist:        pharmacist,
		MedicineReceive:   medicineReceive,
		MedicineRoom:      medicineRoom,
		MedicineDisNo:     medicineDisbursement.MedicineDisNo,
		MedicineDisAmount: medicineDisbursement.MedicineDisAmount,
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

// GET /medicineDisbursement/:id
func GetMedicineDisbursement(c *gin.Context) {
	var medicineDisbursement entity.MedicineDisbursement
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("MedicineRoom").Preload("MedicineReceive").Preload("MedicineReceive.MedicineLabel").Preload("MedicineReceive.MedicineLabel.Order").Preload("MedicineReceive.MedicineLabel.Order.Unit").
		Preload("MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM medicine_disbursements WHERE id = ?", id).Find(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineDisbursement})
}

// GET /medicineDisbursements
func ListMedicineDisbursement(c *gin.Context) {
	var medicineDisbursement []entity.MedicineDisbursement
	if err := entity.DB().Preload("Pharmacist").Preload("MedicineRoom").Preload("MedicineReceive").Preload("MedicineReceive.MedicineLabel").Preload("MedicineReceive.MedicineLabel.Order").Preload("MedicineReceive.MedicineLabel.Order.Unit").
		Preload("MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM medicine_disbursements").Find(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineDisbursement})
}

// DELETE /medicineDisbursement/:id
func DeleteMedicineDisbursement(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_disbursements WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicineDisbursement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicineDisbursement
func UpdateMedicineDisbursement(c *gin.Context) {
	var medicineDisbursement entity.MedicineDisbursement
	var pharmacist entity.User
	var medicineRoom entity.MedicineRoom
	var medicineReceive entity.MedicineReceive

	if err := c.ShouldBindJSON(&medicineDisbursement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineDisbursement.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineReceiveID).First(&medicineReceive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบชื่อยา"})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineRoomID).First(&medicineRoom); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบข้อมูลในการแยกห้องยา"})
		return
	}

	update := entity.MedicineDisbursement{
		Dtime:             medicineDisbursement.Dtime,
		Pharmacist:        medicineDisbursement.Pharmacist,
		MedicineReceive:   medicineDisbursement.MedicineReceive,
		MedicineRoom:      medicineDisbursement.MedicineRoom,
		MedicineDisNo:     medicineDisbursement.MedicineDisNo,
		MedicineDisAmount: medicineDisbursement.MedicineDisAmount,
	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", medicineDisbursement.ID).Updates(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}
