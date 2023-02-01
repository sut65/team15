package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Stat   stat
// POST
func CreateStat(c *gin.Context) {
	var stat entity.Stat
	if err := c.ShouldBindJSON(&stat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&stat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": stat})
}

// GET /stat/:id
func GetStat(c *gin.Context) {
	var stat entity.Stat
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM stats WHERE id = ?", id).Find(&stat).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if stat.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stat})
}

// List
func ListStat(c *gin.Context) {

	var stats []entity.Stat
	if err := entity.DB().Raw("SELECT * FROM stats").Find(&stats).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": stats})

}
