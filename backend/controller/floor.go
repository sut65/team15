
package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /floor
func CreateFloor(c *gin.Context) {
	var floor entity.Floor
	if err := c.ShouldBindJSON(&floor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&floor).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": floor})
}

// GET /floor/:id
func GetFloor(c *gin.Context) {
	var floor entity.Floor
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM Floor WHERE id = ?", id).Find(&floor).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if floor.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": floor})
}

//List
func ListFloor(c *gin.Context) {

	var floor []entity.Floor
	if err := entity.DB().Raw("SELECT * FROM floor").Find(&floor).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": floor})

}