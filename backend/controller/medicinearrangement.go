package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Post /medicinearrangement
func CreateMedicineArrangement(c *gin.Context) {
	var pharmacist entity.User
	var medicinearrangement entity.MedicineArrangement
	var prescription entity.Prescription
	var classifydrug entity.ClassifyDrugs

	if err := c.ShouldBindJSON(&medicinearrangement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// // 9: ค้นหา Prescription ด้วย id
	if tx := entity.DB().Where("id = ?", medicinearrangement.PrescriptionID).First(&prescription); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription not found"})
		return
	}

	// 10: ค้นหา ClassifyMedicine ด้วย id
	if tx := entity.DB().Where("id = ?", medicinearrangement.ClassifyDrugsID).First(&classifydrug); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "classifydrug not found"})
		return
	}

	// 11:ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", medicinearrangement.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	// 13: สร้าง MedicineArrangement
	arrangement := entity.MedicineArrangement{
		MedicineArrangementNo:   medicinearrangement.MedicineArrangementNo,
		Prescription:            prescription, // โยงความสัมพันธ์กับ Entity Prescription
		ClassifyDrugs:           classifydrug, // โยงความสัมพันธ์กับ Entity ClassifyDrugs
		Note:                    medicinearrangement.Note,
		Pharmacist:              pharmacist,                                  // โยงความสัมพันธ์กับ Entity User
		MedicineArrangementTime: medicinearrangement.MedicineArrangementTime, // ตั้งค่าฟิลด์ watchedTime
	}
	if _, err := govalidator.ValidateStruct(arrangement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 14: บันทึก
	if err := entity.DB().Create(&arrangement).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": arrangement})

}

// GET /medicinearrangements/:id
func GetMedicineArrangement(c *gin.Context) {
	var medicinearrangements entity.MedicineArrangement
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Prescription").Preload("Prescription.MedicineLabel").
		Preload("Prescription.MedicineLabel.Order").Preload("Prescription.MedicineLabel.Order.Medicine").
		Preload("ClassifyDrugs").Preload("ClassifyDrugs.Cupboard").
		Raw("SELECT * FROM medicine_arrangements WHERE id = ?", id).Find(&medicinearrangements).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicinearrangements})
}

// GET /medicinearrangements
func ListMedicineArrangement(c *gin.Context) {
	var medicinearrangements []entity.MedicineArrangement
	if err := entity.DB().Preload("Pharmacist").Preload("Prescription").Preload("Prescription.MedicineLabel").
		Preload("Prescription.MedicineLabel.Order").Preload("Prescription.MedicineLabel.Order.Medicine").
		Preload("ClassifyDrugs").Preload("ClassifyDrugs.Cupboard").
		Raw("SELECT * FROM medicine_arrangements").Find(&medicinearrangements).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicinearrangements})
}

// DELETE /medicinearrangements/:id
func DeleteMedicineArrangement(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicine_arrangements WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinearrangements not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicinearrangements
func UpdateMedicineArrangement(c *gin.Context) {
	var pharmacist entity.User
	var medicinearrangement entity.MedicineArrangement
	var prescription entity.Prescription
	var classifydrug entity.ClassifyDrugs

	if err := c.ShouldBindJSON(&medicinearrangement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicinearrangement.PrescriptionID).First(&prescription); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription_id not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", medicinearrangement.ClassifyDrugsID).First(&classifydrug); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "classifydrug_id not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", medicinearrangement.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist_id not found"})
		return
	}

	updatearrangement := entity.MedicineArrangement{
		MedicineArrangementNo:   medicinearrangement.MedicineArrangementNo,
		Prescription:            medicinearrangement.Prescription,
		ClassifyDrugs:           medicinearrangement.ClassifyDrugs,
		Note:                    medicinearrangement.Note,
		Pharmacist:              medicinearrangement.Pharmacist,
		MedicineArrangementTime: medicinearrangement.MedicineArrangementTime,
	}
	if _, err := govalidator.ValidateStruct(updatearrangement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicinearrangement.ID).Updates(&medicinearrangement); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinearranements not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": updatearrangement})
}
