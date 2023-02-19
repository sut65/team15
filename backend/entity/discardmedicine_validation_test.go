package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

//จำนวนต้องมีค่าเป็นบวก และอยู่ในช่วง 1-10000
func TestQuantityDiscardnotbeBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	q := []int{
		0,
		10001,
	}

	for _, qu := range q {
		discard := Discardmedicine{
			Quantity:     qu, //ผิด
			Note: "-",
			Datetime: time.Now(),
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(discard)

	g.Expect(ok).ToNot(BeTrue()) //OK ไม่เป็น true

	g.Expect(err).ToNot(BeNil()) //เช็คว่ามันว่างไหม

	g.Expect(err.Error()).To(Equal("The Quantity must be in the range 1-10000")) //ส่ง error msg

	}

}

func TestDateDiscardNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	discard := Discardmedicine{
		Quantity:     500,
		Note: "-",
		Datetime:        time.Now().Add(time.Minute * -100), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(discard)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the past"))
}


func TestDateDiscardNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	discard := Discardmedicine{
		Quantity:     500,
		Note: "-",
		Datetime:        time.Now().Add(time.Minute * +100), // อดีตผิด วันที่เวลาต้องไม่เป็นอนาคต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(discard)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the future"))
}