package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)
// GET /staffs
// List all ustaffs
func ListReason(c *gin.Context) {
	var reason []entity.Reason
	if err := entity.DB().Raw("SELECT * FROM reasons").Scan(&reason).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}

// GET /staff/:id
// Get staff by id
func GetReason(c *gin.Context) {
	var reason entity.Reason
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM reasons WHERE id = ?", id).Scan(&reason).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}

// POST /staffs
func CreateReason(c *gin.Context) {
	var reason entity.Reason
	if err := c.ShouldBindJSON(&reason); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}

// PATCH /staffs
func UpdateReason(c *gin.Context) {
	var reason entity.Reason
	if err := c.ShouldBindJSON(&reason); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", reason.ID).First(&reason); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}

	if err := entity.DB().Save(&reason).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reason})
}

// DELETE /staffs/:id
func DeleteReason(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM reasons WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reason not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.Staff{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}
