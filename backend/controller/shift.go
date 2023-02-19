package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// unit  =  ช่วงเข้าเวร Shift shift
// POST /medicine
func CreateShift(c *gin.Context) {
	var shift entity.Shift
	if err := c.ShouldBindJSON(&shift); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&shift).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": shift})
}

// GET /medicine/:id
func GetShift(c *gin.Context) {
	var shift entity.Shift
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM shifts WHERE id = ?", id).Find(&shift).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if shift.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": shift})
}

// List
func ListShift(c *gin.Context) {

	var companys []entity.Medicine
	if err := entity.DB().Raw("SELECT * FROM shifts").Find(&companys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": companys})

}
