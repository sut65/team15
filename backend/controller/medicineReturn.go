package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"

	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"
)

func CreateMedicineReturn(c *gin.Context) {
	var order entity.Order
	var Return entity.Return
	var dispensemedicine entity.DispenseMedicine
	var Staff entity.Staff
	var pharmacist entity.User
	var Reason entity.Reason


	if err := c.ShouldBindJSON(&Return); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.DispenseMedicineID).First(&dispensemedicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DispenseMedicine not found"})
		return
	}
	if tx := entity.DB().Where("id = ?", Return.OrderID).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.StaffID).First(&Staff); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "staff not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.ReasonID).First(&Reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reason not found"})
		return
	}

	wv := entity.Return{
		MedicineReturnNo:  Return.MedicineReturnNo,
		ReturnDate:        Return.ReturnDate,
		Pharmacist:        pharmacist,
		Staff:             Staff,
		Order:             order,
		Reason:            Reason,
		DispenseMedicine:  dispensemedicine,
		Note:          Return.Note,
		
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
	if err := entity.DB().Preload("DispenseMedicine").Preload("Pharmacist").Preload("Staff").Preload("Reason").Preload("Order").Preload("Order.Medicine").Raw("SELECT * FROM returns WHERE id = ?", id).Find(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Return})
}

func ListMedicineReturn(c *gin.Context) {
	var Return []entity.Return
	if err := entity.DB().Preload("DispenseMedicine").Preload("Pharmacist").Preload("Staff").Preload("Reason").Preload("Order").Preload("Order.Medicine").Raw("SELECT * FROM returns").Find(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": Return})
}
//ลบ
func DeleteMedicineReturn(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM returns WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Return not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}
func UpdateMedicineReturn(c *gin.Context) {
	var Return entity.Return
	var order entity.Order
	var dispensemedicine entity.DispenseMedicine
	var Staff entity.Staff
	var pharmacist entity.User
	var Reason entity.Reason

	if err := c.ShouldBindJSON(&Return); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", Return.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.DispenseMedicineID).First(&dispensemedicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "DispenseMedicine not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.StaffID).First(&Staff); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Staff not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.OrderID).First(&order); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
		return
	}

	if tx := entity.DB().Where("id = ?", Return.ReasonID).First(&Reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Reason not found"})
		return
	}

	update := entity.Return{
        MedicineReturnNo:  Return.MedicineReturnNo,
		ReturnDate:        Return.ReturnDate,
		Pharmacist:        Return.Pharmacist,
		Staff:             Return.Staff,
		Order:             Return.Order,
		Reason:            Return.Reason,
		DispenseMedicine:  Return.DispenseMedicine,
		Note:              Return.Note,
		

	}
		// ขั้นตอนการ validate
		if _, err := govalidator.ValidateStruct(update); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}	

	if err := entity.DB().Where("id = ?", Return.ID).Updates(&Return).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}

