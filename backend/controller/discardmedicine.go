package controller

import (
	"github.com/sut65/team15/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"

	"net/http"
)

// POST 

func  CreateDiscardmedicine(c *gin.Context) {
	
	var		cause entity.Cause
	var 	medicineReceive entity.MedicineReceive
	var 	pharmacist entity.User	
	var 	discardmedicine	entity.Discardmedicine
	
	if err := c.ShouldBindJSON(&discardmedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา cause ด้วย id
	if tx := entity.DB().Where("id = ?", discardmedicine.CauseID).First(&cause); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cause not found"})
		return
	}

	//  ค้นหา medicineReceive ด้วย id
	if tx := entity.DB().Where("id = ?", discardmedicine.MedicineReceiveID).First(&medicineReceive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company not found"})
		return
	}


	//  ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", discardmedicine.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)

	

	// 13: สร้าง Discardmedicine
	wp := entity.Discardmedicine{
		Note: discardmedicine.Note,
		Datetime:       discardmedicine.Datetime,
		Quantity: discardmedicine.Quantity,
		Cause: cause,
		MedicineReceive: medicineReceive,
		Pharmacist: pharmacist,     // โยงความสัมพันธ์กับ Entity user
		
	}

	// 15: บันทึก
	if err := entity.DB().Create(&wp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wp})

}

// GET /:id
func Discardmedicine(c *gin.Context) {
	var discardmedicine entity.Discardmedicine
	id := c.Param("id")
	if err := entity.DB().Preload("Cause").Preload("MedicineReceive.MedicineLabel.Order").Preload("MedicineReceive.MedicineLabel.Order.Medicine").Preload("MedicineReceive.MedicineLabel.Order.Unit").Preload("Pharmacist").Raw("SELECT * FROM discardmedicines WHERE id = ?", id).Find(&discardmedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": discardmedicine})
}

// GET List

func ListDiscardmedicine(c *gin.Context) {

	var discardmedicines []entity.Discardmedicine
	if err := entity.DB().Preload("Cause").Preload("MedicineReceive.MedicineLabel.Order").Preload("MedicineReceive.MedicineLabel.Order.Medicine").Preload("MedicineReceive.MedicineLabel.Order.Unit").Preload("Pharmacist").Raw("SELECT * FROM discardmedicines").Find(&discardmedicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": discardmedicines})

}

// PATCH 
func UpdateDiscardmedicine(c *gin.Context) {
	var		cause entity.Cause
	var 	medicineReceive entity.MedicineReceive
	var 	pharmacist entity.User	
	var 	discardmedicine	entity.Discardmedicine
	
	if err := c.ShouldBindJSON(&discardmedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", discardmedicine.CauseID).First(&cause); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสาเหตุ"})
		return
	}
	if tx := entity.DB().Where("id = ?", discardmedicine.MedicineReceiveID).First(&medicineReceive); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบยาในคลัง"})
		return
	}

	if tx := entity.DB().Where("id = ?", discardmedicine.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบผู้ใช้"})
		return
	}

	update := entity.Discardmedicine{
		Note: discardmedicine.Note,
		Datetime:       discardmedicine.Datetime,
		Quantity: discardmedicine.Quantity,
		Cause: discardmedicine.Cause,
		MedicineReceive: discardmedicine.MedicineReceive,
		Pharmacist: discardmedicine.Pharmacist,    
	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", discardmedicine.ID).Updates(&discardmedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": discardmedicine})
}

// DELETE /orders/:id
func DeleteDiscardmedicine(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM discardmedicines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "discardmedicines not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.User{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}

