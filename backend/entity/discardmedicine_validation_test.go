package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)


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