
package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /medicine
func CreateCompany(c *gin.Context) {
	var company entity.Company
	if err := c.ShouldBindJSON(&company); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": company})
}

// GET /medicine/:id
func GetCompany(c *gin.Context) {
	var company entity.Company
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM companies WHERE id = ?", id).Find(&company).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": company})
}

//List
func ListCompany(c *gin.Context) {

	var companys []entity.Medicine
	if err := entity.DB().Raw("SELECT * FROM companies").Find(&companys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": companys})

}