package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /pharmacy
func CreatePharmacy(c *gin.Context) {
	var pharmacy entity.Pharmacy

	if err := c.ShouldBindJSON(&pharmacy); err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
	}
	if err := entity.DB().Create(&pharmacy).Error; err != nil {
	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	return
	}
	c.JSON(http.StatusOK, gin.H{"data": pharmacy})
}
// List /pharmacys
func ListPharmacy(c *gin.Context) {
	var pharmacys []entity.Pharmacy
	if err := entity.DB().Raw("SELECT * FROM pharmacys").Find(&pharmacys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pharmacys})
}

// GET /pharmacy/:id
func GetPharmacy(c *gin.Context) {
	var pharmacy entity.Pharmacy
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM pharmacys WHERE id = ?", id).Find(&pharmacy).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if pharmacy.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": pharmacy})
}