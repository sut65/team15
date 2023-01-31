package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"
)
func CreateMedicineReturn(c *gin.Context) {
	var Return entity.Return
	var dispensemedicine entity.DispenseMedicine
	var Staff entity.Staff
	var pharmacist entity.User


	if err := c.ShouldBindJSON(&Return); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.DispenseMedicineID).First(&dispensemedicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.StaffID).First(&Staff); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "side effect not found"})
		return
	}

	wv := entity.Return{
		ReturnDate:        Return.ReturnDate,
		Pharmacist:        pharmacist,
		Staff:             Staff,
		DispenseMedicine:  dispensemedicine,
	}

	if _, err := govalidator.ValidateStruct(wv); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&wv).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wv})
}

func GetMedicineReturn(c *gin.Context) {
	var Return entity.Return
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Staff").Preload("dispensemedicine.DispenseNo").Preload("dispensemedicine.Pharmacy").Raw("SELECT * FROM medicineReceives WHERE id = ?", id).Find(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Return})
}

func ListMedicineReturn(c *gin.Context) {
	var Return []entity.MedicineReceive
	if err := entity.DB().Preload("Pharmacist").Preload("Staff").Preload("dispensemedicine.DispenseNo").Preload("dispensemedicine.Pharmacy").Raw("SELECT * FROM medicineReceives").Find(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Return})
}

func DeleteMedicineReturn(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM Return WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Return not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
func UpdateMedicineReturn(c *gin.Context) {
	var Return entity.Return
	if err := c.ShouldBindJSON(&Return); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", Return.ID).First(&Return); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ambulance not found"})
		return
	}
	if err := entity.DB().Save(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Return})
}

