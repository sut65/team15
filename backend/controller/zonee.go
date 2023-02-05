
package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /zonee
func CreateZonee(c *gin.Context) {
	var zonee entity.Zonee
	if err := c.ShouldBindJSON(&zonee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&zonee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": zonee})
}

// GET /zonee/:id
func GetZonee(c *gin.Context) {
	var zonee entity.Zonee
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM zonee WHERE id = ?", id).Find(&zonee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if zonee.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": zonee})
}

//List
func ListZonee(c *gin.Context) {

	var zonee []entity.Zonee
	if err := entity.DB().Raw("SELECT * FROM Zonee").Find(&zonee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": zonee})

}