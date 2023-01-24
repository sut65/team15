package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /Zone
func CreateZone(c *gin.Context) {
	var zone entity.Zone

	if err := c.ShouldBindJSON(&zone); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&zone).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": zone})
}

// List /Zones
func ListZone(c *gin.Context) {
	var zones []entity.Zone
	if err := entity.DB().Raw("SELECT * FROM zones").Find(&zones).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": zones})
}

// GET /zone/:id
func Getzone(c *gin.Context) {
	var zone entity.Zone
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM zones WHERE id = ?", id).Find(&zone).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if zone.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": zone})
}
