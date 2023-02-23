package controller

import (
	"github.com/asaskevich/govalidator"
	"github.com/sut65/team15/entity"

	"github.com/gin-gonic/gin"

	"net/http"
)

// Post /prescription
func CreatePrescription(c *gin.Context)  {
	var doctor entity.User
	var patient entity.Patient
	var prescription entity.Prescription
	var medicinelabel entity.MedicineLabel

	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
		}

	// 10: ค้นหา medicinelabel ด้วย id
	if tx := entity.DB().Where("id = ?", prescription.MedicineLabelID).First(&medicinelabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicinelabel not found"})
		return
	}

	// 11: ค้นหา patient ด้วย id
	if tx := entity.DB().Where("id = ?", prescription.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// 12:ค้นหา User ด้วย id
	if tx := entity.DB().Where("id = ?", prescription.DoctorID).First(&doctor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "doctor not found"})
		return
	}

	entity.DB().Joins("Role").Find(&doctor)
	if doctor.Role.Name != "Doctor" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Doctor"})
		return
	}

	// 13: สร้าง prescription 
	prescriptionmedicine := entity.Prescription{
		
		Patient:   		patient, 							// โยงความสัมพันธ์กับ Entity patient
		Doctor: 		doctor,								// โยงความสัมพันธ์กับ Entity User
		MedicineLabel: 	medicinelabel,						// โยงความสัมพันธ์กับ Entity MedicineLabel
		Number: 		prescription.Number,       					
		Note:			prescription.Note,
		Datetime:		prescription.Datetime, 		// ตั้งค่าฟิลด์ watchedTime
	}
	if _, err := govalidator.ValidateStruct(prescriptionmedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 14: บันทึก
	if err := entity.DB().Create(&prescriptionmedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prescriptionmedicine})

}

// GET /prescription/:id
func GetPrescription(c *gin.Context) {
	var prescription entity.Prescription
	id := c.Param("id")
	if err := entity.DB().Preload("Doctor").Preload("Patient").Preload("MedicineLabel").Preload("MedicineLabel.Order").Preload("MedicineLabel.Order.Medicine").Raw("SELECT * FROM prescriptions WHERE id = ?", id).Find(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": prescription})
}

// GET /prescription
func ListPrescription(c *gin.Context) {
	var prescription []entity.Prescription
	if err := entity.DB().Preload("Doctor").Preload("Patient").Preload("MedicineLabel").Preload("MedicineLabel.Order").Preload("MedicineLabel.Order.Medicine").Raw("SELECT * FROM prescriptions ").Find(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": prescription})
}

// DELETE /prescription/:id
func DeletePrescription(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM prescriptions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prescription not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /prescription
func UpdatePrescription(c *gin.Context) {
	var doctor entity.User
	var patient entity.Patient
	var prescription entity.Prescription
	var medicinelabel entity.MedicineLabel
	

	if err := c.ShouldBindJSON(&prescription); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", prescription.DoctorID).First(&doctor); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบสมาชิก"})
		return
	}

	entity.DB().Joins("Role").Find(&doctor)
	if doctor.Role.Name != "Doctor" { 
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Doctor"})
		return
	}

	if tx := entity.DB().Where("id = ?", prescription.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ patient"})
		return
	}

	if tx := entity.DB().Where("id = ?", prescription.MedicineLabelID).First(&medicinelabel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ไม่พบ medicine"})
		return
	}

	update := entity.Prescription{
		Doctor:                 prescription.Doctor,
		Patient:              	prescription.Patient,
		MedicineLabel:    		prescription.MedicineLabel,
		Note:					prescription.Note,
		Datetime:				prescription.Datetime, 		// ตั้งค่าฟิลด์ watchedTime
		Number:					prescription.Number,

	}

	// ขั้นตอนการ validate
	if _, err := govalidator.ValidateStruct(update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Where("id = ?", prescription.ID).Updates(&prescription).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": update})
}
