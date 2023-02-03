package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// GET /cause
func ListCause(c *gin.Context) {
	var causes []entity.Role
	if err := entity.DB().Raw("SELECT * FROM causes").Find(&causes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": causes})
}