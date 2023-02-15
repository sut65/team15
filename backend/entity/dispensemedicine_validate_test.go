package entity

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

)

func TestDataDispenseMedicineCorrect(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		100000,
			ReceiveName:		"แสนดีมากมาย",	                 		
			DispenseTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(dispense)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestNoteDispenseMedicineNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check ReceiveName not blank", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		200000,
			ReceiveName:		""	,	//ผิด                		
			DispenseTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(dispense)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("ReceiveName cannot be blank"))
	})
}

func TestNoDispenseMedicine(t *testing.T) {
		g := NewGomegaWithT(t)
		t.Run("check pattern DispenseNo range 100000|999999", func(t *testing.T) {
			d := []uint{
				1,         // ผิด 1 หลัก ต้องเป็นเลข 6 ตัว
				12,        // ผิด 2 หลัก ต้องเป็นเลข 6 ตัว
				103,       // ผิด 3 หลัก ต้องเป็นเลข 6 ตัว
				1004,      // ผิด 4 หลัก ต้องเป็นเลข 6 ตัว
				10005,     // ผิด 5 หลัก ต้องเป็นเลข 6 ตัว
				1000007,   // ผิด 7 หลัก ต้องเป็นเลข 6 ตัว
				10000008,  // ผิด 8 หลัก ต้องเป็นเลข 6 ตัว
				100000009, // ผิด 9 หลัก ต้องเป็นเลข 6 ตัว
			}
			for _, d := range d {
				dispensemedicine := DispenseMedicine{
					DispenseNo: 		d,		//ผิด
					ReceiveName:		"แสนดี มากมาย"	,	                  		
					DispenseTime:	time.Now(),
				}
		
				// ตรวจสอบด้วย govalidator
				ok, err := govalidator.ValidateStruct(dispensemedicine)
		
				// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
				g.Expect(ok).ToNot(BeTrue())
		
				// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
				g.Expect(err).ToNot(BeNil())
		
				// err.Error ต้องมี error message แสดงออกมา
				g.Expect(err.Error()).To(Equal("DispensemedicineNo must be 6 digits"))
			}
		})
}
func TestDispenseMedicineNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check DispenseTime not be past", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		100000,		
			ReceiveName:		"แสนดี มากมาย"	,	                  		
			DispenseTime:	time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
		}

		ok, err := govalidator.ValidateStruct(dispense)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("DispenseTime not be past"))
	})
}