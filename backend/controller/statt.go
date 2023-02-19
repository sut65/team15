package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// statt Statt = company
// POST /medicine
func CreateStatt(c *gin.Context) {
	var statt entity.Statt
	if err := c.ShouldBindJSON(&statt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&statt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": statt})
}

// GET /medicine/:id
func GetStatt(c *gin.Context) {
	var statt entity.Statt
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM statts WHERE id = ?", id).Find(&statt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if statt.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": statt})
}

// List
func ListStatt(c *gin.Context) {

	var statts []entity.Medicine
	if err := entity.DB().Raw("SELECT * FROM statts").Find(&statts).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": statts})

}
