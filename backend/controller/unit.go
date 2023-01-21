
package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /medicine
func CreateUnit(c *gin.Context) {
	var unit entity.Unit
	if err := c.ShouldBindJSON(&unit); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&unit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": unit})
}

// GET /medicine/:id
func GetUnit(c *gin.Context) {
	var unit entity.Unit
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM units WHERE id = ?", id).Find(&unit).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if unit.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": unit})
}

//List
func ListUnit(c *gin.Context) {

	var companys []entity.Medicine
	if err := entity.DB().Raw("SELECT * FROM units").Find(&companys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": companys})

}