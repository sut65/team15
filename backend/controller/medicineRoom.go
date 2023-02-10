package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// POST /MedicineRoom
func CreateMedicineRoom(c *gin.Context) {
	var medicineRoom entity.MedicineRoom

	if err := c.ShouldBindJSON(&medicineRoom); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := entity.DB().Create(&medicineRoom).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineRoom})
}

// List /MedicineRooms
func ListMedicineRoom(c *gin.Context) {
	var medicineRooms []entity.MedicineRoom
	if err := entity.DB().Raw("SELECT * FROM medicine_rooms").Find(&medicineRooms).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": medicineRooms})
}

// GET /MedicineRoom/:id
func GetMedicineRoom(c *gin.Context) {
	var medicineRoom entity.MedicineRoom
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicine_rooms WHERE id = ?", id).Find(&medicineRoom).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if medicineRoom.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicineRoom})
}
