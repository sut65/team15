package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut65/team15/entity"

	"net/http"
)

// POST

func CreateAttendance(c *gin.Context) {

	var statt entity.Statt
	var shift entity.Shift
	var pharmacist entity.User
	var attendance entity.Attendance

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร Patient
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 10: ค้นหา statt ด้วย id
	if tx := entity.DB().Where("id = ?", attendance.StattID).First(&statt); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "statt not found"})
		return
	}

	// 11: ค้นหา shift ด้วย id
	if tx := entity.DB().Where("id = ?", attendance.ShiftID).First(&shift); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "shift not found"})
		return
	}

	// 12: ค้นหา user ด้วย id
	if tx := entity.DB().Where("id = ?", attendance.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	entity.DB().Joins("Role").Find(&pharmacist)

	// 13: สร้าง Attendance
	wp := entity.Attendance{
		Phone:       attendance.Phone,
		Description: attendance.Description,
		Datetime:    attendance.Datetime,

		Statt:      statt,      // โยงความสัมพันธ์กับ Entity Statt
		Shift:      shift,      // โยงความสัมพันธ์กับ Entity Shift
		Pharmacist: pharmacist, // โยงความสัมพันธ์กับ Entity user

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

// GET /attendance/:id
func GetAttendance(c *gin.Context) {
	var attendance entity.Attendance
	id := c.Param("id")
	if err := entity.DB().Preload("Statt").Preload("Pharmacist").Preload("Shift").Raw("SELECT * FROM attendances WHERE id = ?", id).Find(&attendance).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": attendance})
}

// GET List

func ListAttendance(c *gin.Context) {

	var attendances []entity.Attendance
	if err := entity.DB().Preload("Statt").Preload("Pharmacist").Preload("Shift").Raw("SELECT * FROM attendances").Find(&attendances).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": attendances})

}

// PATCH
func UpdateAttendance(c *gin.Context) {

	var statt entity.Statt
	var shift entity.Shift
	var pharmacist entity.User
	var attendance entity.Attendance

	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.StattID).First(&statt); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ บริษัท"})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.ShiftID).First(&shift); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบหน่วย"})
		return
	}

	update := entity.Attendance{
		Phone:       attendance.Phone,
		Description: attendance.Description,
		Datetime:    attendance.Datetime,

		Statt:      attendance.Statt,
		Shift:      attendance.Shift,
		Pharmacist: attendance.Pharmacist,
	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", attendance.ID).Updates(&attendance).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}

// DELETE /attendances/:id
func DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM attendances WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "attendance not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.User{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}
