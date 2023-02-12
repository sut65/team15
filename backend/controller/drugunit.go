package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /drugunit
func CreateDrugunit(c *gin.Context) {
	var drugunit entity.DrugUnit

	if err := c.ShouldBindJSON(&drugunit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&drugunit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": drugunit})
}

// List /drugunits
func ListDrugunit(c *gin.Context) {
	var drugunits []entity.DrugUnit
	if err := entity.DB().Raw("SELECT * FROM drugunits").Find(&drugunits).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": drugunits})
}

// GET /drugunit/:id
func GetDrugunit(c *gin.Context) {
	var drugunit entity.DrugUnit
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM drugunits WHERE id = ?", id).Find(&drugunit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if drugunit.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": drugunit})
}
