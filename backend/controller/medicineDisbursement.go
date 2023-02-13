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
	var drugunit entity.DrugUnit

	//เช็คว่าตรงกันมั้ย
	if err := c.ShouldBindJSON(&medicineDisbursement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	//  10: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}
	// 12: ค้นหา MedicineReceive ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineReceiveID).First(&medicineReceive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}
	// 11: ค้นหา medicineRoom ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.MedicineRoomID).First(&medicineRoom); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}
	// 11: ค้นหา drugunit ด้วย id
	if tx := entity.DB().Where("id = ?", medicineDisbursement.DrugUnitID).First(&drugunit); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}
	// 14: สร้าง MedicineDisbursement
	wv := entity.MedicineDisbursement{

		Dtime:      medicineDisbursement.Dtime,
		Pharmacist:        pharmacist,
		MedicineReceive:     medicineReceive,
		MedicineRoom:              medicineRoom,
		DrugUnit:	drugunit,
		MedicineDisNo: medicineDisbursement.MedicineDisNo,
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
	if err := entity.DB().Preload("Pharmacist").Preload("MedicineRoom").Preload("DrugUnit").
	Preload("MedicineReceive").Preload("MedicineReceive.MedicineLabel").Preload("MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM medicine_disbursements WHERE id = ?", id).Find(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineDisbursement})
}

// GET /medicineDisbursements
func ListMedicineDisbursement(c *gin.Context) {
	var medicineDisbursement []entity.MedicineDisbursement
	if err := entity.DB().Preload("Pharmacist").Preload("MedicineRoom").Preload("DrugUnit").
	Preload("MedicineReceive").Preload("MedicineReceive.MedicineLabel").Preload("MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM medicine_disbursements").Find(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineDisbursement})
}

// DELETE /medicineDisbursement/:id
func DeleteMedicineDisbursement(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicinedisbursements WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicineDisbursement not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicineDisbursement
func UpdateMedicineDisbursement(c *gin.Context) {
	var medicineDisbursement entity.MedicineDisbursement
	if err := c.ShouldBindJSON(&medicineDisbursement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", medicineDisbursement.ID).First(&medicineDisbursement); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulance not found"})
		return
	}
	if err := entity.DB().Save(&medicineDisbursement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineDisbursement})
}
