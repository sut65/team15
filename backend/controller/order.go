package controller

import (
	"github.com/sut65/team15/entity"
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"

	"net/http"
)

// POST 

func CreateOrder(c *gin.Context) {

	var medicine entity.Medicine
	var company entity.Company
	var unit entity.Unit
	var pharmacist entity.User
	var order entity.Order

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร Patient
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา medicine ด้วย id
	if tx := entity.DB().Where("id = ?", order.MedicineID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	// 10: ค้นหา company ด้วย id
	if tx := entity.DB().Where("id = ?", order.CompanyID).First(&company); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "company not found"})
		return
	}

	// 11: ค้นหา unit ด้วย id
	if tx := entity.DB().Where("id = ?", order.UnitID).First(&unit); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unit not found"})
		return
	}

	// 12: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", order.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	// 13: สร้าง Order
	wp := entity.Order{
		Ordernumber: order.Ordernumber,
		Quantity: order.Quantity,
		Priceperunit:  order.Priceperunit,
		Datetime:       order.Datetime,
		
		Medicine: medicine, // โยงความสัมพันธ์กับ Entity medicine
		Company:       company,       // โยงความสัมพันธ์กับ Entity Company
		Unit:       unit,       // โยงความสัมพันธ์กับ Entity Unit
		Pharmacist: pharmacist,     // โยงความสัมพันธ์กับ Entity user
		
	}

	if _, err := govalidator.ValidateStruct(wp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 15: บันทึก
	if err := entity.DB().Create(&wp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wp})

}

// GET /order/:id
func GetOrder(c *gin.Context) {
	var order entity.Order
	id := c.Param("id")
	if err := entity.DB().Preload("Medicine").Preload("Company").Preload("Pharmacist").Preload("Unit").Raw("SELECT * FROM orders WHERE id = ?", id).Find(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": order})
}

// GET List

func ListOrder(c *gin.Context) {

	var orders []entity.Order
	if err := entity.DB().Preload("Medicine").Preload("Company").Preload("Pharmacist").Preload("Unit").Raw("SELECT * FROM orders").Find(&orders).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})

}

// PATCH 
func UpdateOrder(c *gin.Context) {
	
	
	var medicine entity.Medicine
	var company entity.Company
	var unit entity.Unit
	var pharmacist entity.User
	var order entity.Order
	

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", order.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)
	if pharmacist.Role.Name != "Pharmacist" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Pharmacist"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.CompanyID).First(&company); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ บริษัท"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.MedicineID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบยา"})
		return
	}

	if tx := entity.DB().Where("id = ?", order.UnitID).First(&unit); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบหน่วย"})
		return
	}

	update := entity.Order{
		Ordernumber: order.Ordernumber,
		Quantity: order.Quantity,
		Priceperunit:  order.Priceperunit,
		Datetime:       order.Datetime,
		
		Medicine: order.Medicine, 
		Company:       order.Company,   
		Unit:       order.Unit,       
		Pharmacist: order.Pharmacist,  

	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", order.ID).Updates(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}

// DELETE /orders/:id
func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	
	if tx := entity.DB().Exec("DELETE FROM orders WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "order not found"})
		return
	}
	

	c.JSON(http.StatusOK, gin.H{"data": id})
}