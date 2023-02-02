package entity

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

)

func TestDataMedicineArrangementCorrect(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		arrangement := MedicineArrangement{
			MedicineArrangementNo: 		200000,
			Note:						"มีการเปลี่ยนยี่ห้อยา"	,	                 		
			MedicineArrangementTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(arrangement)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

// func TestNoteMedicineArrangementNotBlank(t *testing.T) {
// 	g := NewGomegaWithT(t)
// 	t.Run("check note not blank", func(t *testing.T) {
// 		arrangement := MedicineArrangement{
// 			MedicineArrangementNo: 		200000,
// 			Note:						""	,	//ผิด                		
// 			MedicineArrangementTime:	time.Now(),
// 		}
// 		ok, err := govalidator.ValidateStruct(arrangement)
// 		g.Expect(ok).NotTo(BeTrue())			
// 		g.Expect(err).ToNot(BeNil())			
// 		g.Expect(err.Error()).To(Equal("Note cannot be blank"))
// 	})
// }

func TestNoMedicineArrangement1(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern medicinearrangno number 6 digit", func(t *testing.T) {
			arrangement := MedicineArrangement{
				MedicineArrangementNo: 		2000,	//ผิด	
				Note:						"มีการเปลี่ยนยี่ห้อยา"	,	                  		
				MedicineArrangementTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(arrangement)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("MedicineArrangement dose not validate as matches(^\\d{6}$)"))
	})
}

func TestNoMedicineArrangement2(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern medicinearrangno non zero", func(t *testing.T) {
			arrangement := MedicineArrangement{
				MedicineArrangementNo: 		0,		//ผิด
				Note:						"มีการเปลี่ยนยี่ห้อยา"	,	                  		
				MedicineArrangementTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(arrangement)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("MedicineArrangementNo: non zero value required"))
	})
}

func TestNoMedicineArrangement3(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern medicinearrangno range 200000|999999", func(t *testing.T) {
			arrangement := MedicineArrangement{
				MedicineArrangementNo: 		100000,		//ผิด
				Note:						"มีการเปลี่ยนยี่ห้อยา"	,	                  		
				MedicineArrangementTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(arrangement)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("MedicineArrangementNo: range 200000|999999"))
	})
}