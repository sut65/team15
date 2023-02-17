package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// เลขบิลต้องมีค่าเป็นบวก และอยู่ในช่วง 10000-99999
func TestBillNonotbeBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	q := []uint{
		9999,
		1000001,
	}

	for _, qu := range q {
		bill := Bill{
			BillNo:   qu, //ผิด
			Total:    200,
			BillTime: time.Now(),
			Payer:    "dd",
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(bill)

		g.Expect(ok).ToNot(BeTrue()) //OK ไม่เป็น true

		g.Expect(err).ToNot(BeNil()) //เช็คว่ามันว่างไหม

		g.Expect(err.Error()).To(Equal("The BillNo must be in the range 10000-99999")) //ส่ง error msg

	}

}

// ราคายาต้องมีค่าเป็นบวก และอยู่ในช่วง 1-10000
func TestTotalperunit(t *testing.T) {
	g := NewGomegaWithT(t)

	ppu := []uint{
		0,
		10001,
	}

	for _, qu := range ppu {
		bill := Bill{
			BillNo:   10000,
			Total:    qu,
			BillTime: time.Now(),
			Payer:    "dd",
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(bill)

		g.Expect(ok).ToNot(BeTrue()) //เช็คว่ามันเป็นค่าจริงไหม

		g.Expect(err).ToNot(BeNil()) //เช็คว่ามันว่างไหม

		g.Expect(err.Error()).To(Equal("The Total must be in the range 1-10000")) //ส่ง error ms

	}

}

func TestDateBillNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   10000,
		Total:    200,
		BillTime: time.Now().Add(time.Minute * -100), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
		Payer:    "dd",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the past"))
}

func TestDateBillNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillNo:   10000,
		Total:    200,
		BillTime: time.Now().Add(time.Minute * +100), // อดีตผิด วันที่เวลาต้องไม่เป็นอนาคต
		Payer:    "dd",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the future"))
}
