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

func TestNoteMedicineArrangementNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check note not blank", func(t *testing.T) {
		arrangement := MedicineArrangement{
			MedicineArrangementNo: 		200000,
			Note:						""	,	//ผิด                		
			MedicineArrangementTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(arrangement)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("Note cannot be blank"))
	})
}

func TestNoMedicineArrangement(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern MedicineArrangementNo range 200000|999999", func(t *testing.T) {
		a := []uint{
			2,         // ผิด 1 หลัก ต้องเป็นเลข 6 ตัว
			22,        // ผิด 2 หลัก ต้องเป็นเลข 6 ตัว
			203,       // ผิด 3 หลัก ต้องเป็นเลข 6 ตัว
			2004,      // ผิด 4 หลัก ต้องเป็นเลข 6 ตัว
			20005,     // ผิด 5 หลัก ต้องเป็นเลข 6 ตัว
			2000007,   // ผิด 7 หลัก ต้องเป็นเลข 6 ตัว
			20000008,  // ผิด 8 หลัก ต้องเป็นเลข 6 ตัว
			200000009, // ผิด 9 หลัก ต้องเป็นเลข 6 ตัว
		}
		for _, a := range a {
			arrangement := MedicineArrangement{
				MedicineArrangementNo: 		a,		//ผิด
				Note:						"มีการเปลี่ยนยี่ห้อยา",	                  		
				MedicineArrangementTime:	time.Now(),
			}
	
			// ตรวจสอบด้วย govalidator
			ok, err := govalidator.ValidateStruct(arrangement)
	
			// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
			g.Expect(ok).ToNot(BeTrue())
	
			// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
			g.Expect(err).ToNot(BeNil())
	
			// err.Error ต้องมี error message แสดงออกมา
			g.Expect(err.Error()).To(Equal("MedicineArrangementNo must be 6 digits"))
		}
	})
}

func TestMedicineArrangementNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check MedicineArrangementTime not be past", func(t *testing.T) {
			arrangement := MedicineArrangement{
				MedicineArrangementNo: 		200000,		
				Note:						"มีการเปลี่ยนยี่ห้อยา"	,	                  		
				MedicineArrangementTime:	time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
			}

			ok, err := govalidator.ValidateStruct(arrangement)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("MedicineArrangementTime not be past"))
	})
}