package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)
// GET /staffs
// List all ustaffs
func ListStaffs(c *gin.Context) {
	var staffs []entity.Staff
	if err := entity.DB().Raw("SELECT * FROM staffs").Scan(&staffs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": staffs})
}

// GET /staff/:id
// Get staff by id
func GetStaff(c *gin.Context) {
	var staff entity.Staff
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM staffs WHERE id = ?", id).Scan(&staff).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": staff})
}

// POST /staffs
func CreateStaff(c *gin.Context) {
	var staff entity.Staff
	if err := c.ShouldBindJSON(&staff); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": staff})
}

// PATCH /staffs
func UpdateStaff(c *gin.Context) {
	var staff entity.Staff
	if err := c.ShouldBindJSON(&staff); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", staff.ID).First(&staff); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "staff not found"})
		return
	}

	if err := entity.DB().Save(&staff).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": staff})
}

// DELETE /staffs/:id
func DeleteStaff(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM staffs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "staff not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.Staff{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}
