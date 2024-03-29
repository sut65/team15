package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Post /classifydrugs
func CreateClassifyDrugs(c *gin.Context)  {
	var pharmacist entity.User
	var cupboard entity.Cupboard
	var zonee entity.Zonee
	var floor entity.Floor
	var classifydrugs entity.ClassifyDrugs
	var medicinedisbursement entity.MedicineDisbursement

	if err := c.ShouldBindJSON(&classifydrugs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
		}
	// 9: ค้นหา medicinedisbursement ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.MedicineDisbursementID).First(&medicinedisbursement); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinedisbursement not found"})
		return
	}

	// 10: ค้นหา cupboard ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.CupboardID).First(&cupboard); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cupboard not found"})
		return
	}

	// 11: ค้นหา zonee ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.ZoneeID).First(&zonee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "zonee not found"})
		return
	}

	// 12: ค้นหา floor ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.FloorID).First(&floor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "floor not found"})
		return
	}

	// 13:ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	// 14: สร้าง classifydrug 
	classifydrug := entity.ClassifyDrugs{
		
		Cupboard:   	cupboard, 							// โยงความสัมพันธ์กับ Entity cupboard
		Zonee:   		zonee, 								// โยงความสัมพันธ์กับ Entity zonee
		Floor:   		floor, 								// โยงความสัมพันธ์กับ Entity floor
		Pharmacist: 	pharmacist,       					// โยงความสัมพันธ์กับ Entity User
		MedicineDisbursement: medicinedisbursement,
		Note:			classifydrugs.Note,
		Datetime:		classifydrugs.Datetime, 		// ตั้งค่าฟิลด์ watchedTime
		Number:			classifydrugs.Number,
	}
	if _, err := govalidator.ValidateStruct(classifydrug); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 15: บันทึก
	if err := entity.DB().Create(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": classifydrug})

}

// GET /classifydrug/:id
func GetClassifyDrug(c *gin.Context) {
	var classifydrug entity.ClassifyDrugs
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Cupboard").Preload("Zonee").Preload("Floor").Preload("MedicineDisbursement").
	Preload("MedicineDisbursement.MedicineReceive").Preload("MedicineDisbursement.MedicineReceive.MedicineLabel").Preload("MedicineDisbursement.MedicineReceive.MedicineLabel.Order").
	Preload("MedicineDisbursement.MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM classify_drugs WHERE id = ?", id).Find(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": classifydrug})
}

// GET /classifydrug
func ListClassifyDrug(c *gin.Context) {
	var classifydrug []entity.ClassifyDrugs
	if err := entity.DB().Preload("Pharmacist").Preload("Cupboard").Preload("Zonee").Preload("Floor").Preload("MedicineDisbursement").
	Preload("MedicineDisbursement.MedicineReceive").Preload("MedicineDisbursement.MedicineReceive.MedicineLabel").Preload("MedicineDisbursement.MedicineReceive.MedicineLabel.Order").
	Preload("MedicineDisbursement.MedicineReceive.MedicineLabel.Order.Medicine").Raw("SELECT * FROM classify_drugs").Find(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": classifydrug})
}

// DELETE /classifydrug/:id
func DeleteClassifyDrug(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM classify_drugs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "classifydrugs not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /classifydrug
func UpdateClassifyDrug(c *gin.Context) {
	var pharmacist entity.User
	var cupboard entity.Cupboard
	var zonee entity.Zonee
	var floor entity.Floor
	var classifydrugs entity.ClassifyDrugs
	var medicinedisbursement entity.MedicineDisbursement
	

	if err := c.ShouldBindJSON(&classifydrugs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.CupboardID).First(&cupboard); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ cupboard"})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.ZoneeID).First(&zonee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ zonee"})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.FloorID).First(&floor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ floor"})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.MedicineDisbursementID).First(&medicinedisbursement); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ medicine"})
		return
	}

	update := entity.ClassifyDrugs{
		Cupboard:                classifydrugs.Cupboard,
		Zonee:                   classifydrugs.Zonee,
		Floor:                   classifydrugs.Floor,
		Pharmacist:              classifydrugs.Pharmacist,
		MedicineDisbursement:    classifydrugs.MedicineDisbursement,
		Note:			classifydrugs.Note,
		Datetime:		classifydrugs.Datetime, 		// ตั้งค่าฟิลด์ watchedTime
		Number:			classifydrugs.Number,

	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", classifydrugs.ID).Updates(&classifydrugs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}

