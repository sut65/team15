package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /patient
func CreatePatient(c *gin.Context) {
	var patient entity.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": patient})
}

// GET /patient/:id
func GetPatient(c *gin.Context) {
	var patient entity.Patient
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM patient WHERE id = ?", id).Find(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if patient.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})
}

//List
func ListPatient(c *gin.Context) {

	var patient []entity.Patient
	if err := entity.DB().Raw("SELECT * FROM patient").Find(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})

}