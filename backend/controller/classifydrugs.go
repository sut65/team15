package controller

import (
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Post /classifydrugs
func CreateClassifyDrugs(c *gin.Context)  {
	var pharmacist entity.User
	var cupboard entity.Cupboard
	var classifydrugs entity.ClassifyDrugs

	if err := c.ShouldBindJSON(&classifydrugs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
		}
	// 9: ค้นหา Bill ด้วย id


	// 10: ค้นหา cupboard ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.PharmacistID).First(&cupboard); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cupboard not found"})
		return
	}

	// 11:ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", classifydrugs.PharmacistID).First(&pharmacist); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "pharmacist not found"})
		return
	}

	// 13: สร้าง DispenseMedicine 
	classifydrug := entity.ClassifyDrugs{
		
		Cupboard:   	cupboard, 							// โยงความสัมพันธ์กับ Entity cupboard
		Pharmacist: 	pharmacist,       					// โยงความสัมพันธ์กับ Entity User
		Note:			classifydrugs.Note,
		Datetime:		classifydrugs.Datetime, 		// ตั้งค่าฟิลด์ watchedTime
	}

	// 14: บันทึก
	if err := entity.DB().Create(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": classifydrug})

}

// GET /classifydrug/:id
func GetClassifyDrug(c *gin.Context) {
	var classifydrug entity.ClassifyDrugs
	id := c.Param("id")
	if err := entity.DB().Preload("Pharmacist").Preload("Cupboard").Raw("SELECT * FROM classifydrugs WHERE id = ?", id).Find(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": classifydrug})
}

// GET /classifydrug
func ListClassifyDrug(c *gin.Context) {
	var classifydrug []entity.ClassifyDrugs
	if err := entity.DB().Preload("Pharmacist").Preload("Cipboard").Raw("SELECT * FROM classifydrug ORDER BY cupboard").Find(&classifydrug).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": classifydrug})
}

// DELETE /classifydrug/:id
func DeleteClassifyDrug(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM classifydrugs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "classifydrugs not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /classifydrug
func UpdateClassifyDrug(c *gin.Context) {
	var classifydrugs entity.ClassifyDrugs
	if err := c.ShouldBindJSON(&classifydrugs); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", classifydrugs.ID).First(&classifydrugs); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "classifydrugs not found"})
		return
	}

	if err := entity.DB().Save(&classifydrugs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": classifydrugs})
}