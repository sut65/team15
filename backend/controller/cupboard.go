
package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /cupboard
func CreateCupboard(c *gin.Context) {
	var cupboard entity.Cupboard
	if err := c.ShouldBindJSON(&cupboard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&cupboard).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": cupboard})
}

// GET /cupboard/:id
func GetCupboard(c *gin.Context) {
	var cupboard entity.Cupboard
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM cupboards WHERE id = ?", id).Find(&cupboard).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if cupboard.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cupboard})
}

//List
func ListCupboard(c *gin.Context) {

	var cupboard []entity.Cupboard
	if err := entity.DB().Raw("SELECT * FROM cupboards").Find(&cupboard).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cupboard})

}