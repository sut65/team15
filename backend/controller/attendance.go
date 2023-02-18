package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST

func CreateAttendance(c *gin.Context) {

	var stat entity.Stat             //medicine = ยา   | หน้าที่ = Stat
	var shift entity.Shift           //Unit = หน่วย      | ช่วงเข้าเวร = Shift
	var pharmacist entity.User       //pharmacist = เภสัชกร | เหมือนเดิม
	var attendance entity.Attendance // order (en หลัก)  |  Attendance

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร Patient
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 9: ค้นหา stat ด้วย id
	if tx := entity.DB().Where("id = ?", attendance.StatID).First(&stat); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "stat not found"})
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

	// if pharmacist.Role.Name != "Nurse" {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "only for dentsit"})
	// 	return
	// }

	// 13: สร้าง Attendance
	wp := entity.Attendance{
		Phone:       attendance.Phone,
		Description: attendance.Description,
		Datetime:    attendance.Datetime,

		Stat:       stat,       // โยงความสัมพันธ์กับ Entity stat
		Shift:      shift,      // โยงความสัมพันธ์กับ Entity Shift
		Pharmacist: pharmacist, // โยงความสัมพันธ์กับ Entity user

	}

	// 15: บันทึก
	if err := entity.DB().Create(&wp).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": wp})

}

// GET /payment/:id
func GetAttendance(c *gin.Context) {
	var attendance entity.Attendance
	id := c.Param("id")
	if err := entity.DB().Preload("Stat").Preload("Pharmacist").Preload("Shift").Raw("SELECT * FROM attendances WHERE id = ?", id).Find(&attendance).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": attendance})
}

// GET List

func ListAttendance(c *gin.Context) {

	var attendances []entity.Attendance
	if err := entity.DB().Preload("Stat").Preload("Pharmacist").Preload("Shift").Raw("SELECT * FROM attendances").Find(&attendances).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": attendances})

}

// DELETE /attendances/:id
func DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM attendances WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "attendances not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH
func UpdateAttendance(c *gin.Context) {

	var stat entity.Stat             //medicine = ยา   | หน้าที่ = Stat
	var shift entity.Shift           //Unit = หน่วย      | ช่วงเข้าเวร = Shift
	var pharmacist entity.User       //pharmacist = เภสัชกร | เหมือนเดิม
	var attendance entity.Attendance // order (en หลัก)  |  Attendance

	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.StatID).First(&stat); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "หน้าที่"})
		return
	}

	if tx := entity.DB().Where("id = ?", attendance.ShiftID).First(&shift); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ช่วงเวลาที่เข้าเวร"})
		return
	}

	update := entity.Attendance{

		Phone:       attendance.Phone,
		Description: attendance.Description,
		Datetime:    attendance.Datetime,

		Stat:       attendance.Stat,       // โยงความสัมพันธ์กับ Entity stat
		Shift:      attendance.Shift,      // โยงความสัมพันธ์กับ Entity Shift
		Pharmacist: attendance.Pharmacist, // โยงความสัมพันธ์กับ Entity user
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
