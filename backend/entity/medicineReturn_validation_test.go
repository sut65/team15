package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	Return := Return{
		MedicineReturnNo: 500000,

		Note: "ไม่มีซองยา",
		
		ReturnDate:        time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(Return)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	Return := Return{

		Note: "",
		ReturnDate:        time.Now(),
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(Return)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Note cannot be blank"))
}

func TestMedicineReturnNo(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern MedicineReturnNo range 500000|999999", func(t *testing.T) {
		a := []uint{
			5,         // ผิด 1 หลัก ต้องเป็นเลข 6 ตัว
			55,        // ผิด 2 หลัก ต้องเป็นเลข 6 ตัว
			503,       // ผิด 3 หลัก ต้องเป็นเลข 6 ตัว
			5004,      // ผิด 4 หลัก ต้องเป็นเลข 6 ตัว
			50005,     // ผิด 5 หลัก ต้องเป็นเลข 6 ตัว
			5000007,   // ผิด 7 หลัก ต้องเป็นเลข 6 ตัว
			50000008,  // ผิด 8 หลัก ต้องเป็นเลข 6 ตัว
			500000009, // ผิด 9 หลัก ต้องเป็นเลข 6 ตัว
		}
		for _, a := range a {
			Return := Return{
				MedicineReturnNo: 		a,		//ผิด
				Note:               "ไม่มีซองยา",
	            ReturnDate:        time.Now(),
			}
	
			// ตรวจสอบด้วย govalidator
			ok, err := govalidator.ValidateStruct(Return)
	
			// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
			g.Expect(ok).ToNot(BeTrue())
	
			// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
			g.Expect(err).ToNot(BeNil())
	
			// err.Error ต้องมี error message แสดงออกมา
			g.Expect(err.Error()).To(Equal("MedicineReturnNo must be 6 digits"))
		}
	})
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error ...

func TestDateBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	Return := Return{

		Note: "ไม่มีซองยา",
		ReturnDate:  time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต

	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(Return)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Return not be past"))
}

func TestDateBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	Return := Return{
		Note: "ไม่มีซองยา",
		ReturnDate:        time.Now().Add(time.Minute * +100), // อดีตผิด วันที่เวลาต้องไม่เป็นอนาคต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(Return)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Return must not be in the future"))
}
