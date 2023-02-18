package entity

import (
	"testing"
	//"fmt"

	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestDescriptionNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	attendance := Attendance{
		Phone:       "0987654321",
		Description: "",
		Datetime:    time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(attendance)
	g.Expect(ok).NotTo(BeTrue())
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("Description cannot be blank"))

}

func TestPhone(t *testing.T) {
	g := NewGomegaWithT(t)
	attendance := Attendance{
		Phone:       "000000",
		Description: "aaa",
		Datetime:    time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(attendance)

	g.Expect(ok).ToNot(BeTrue()) //เช็คว่ามันเป็นค่าจริงไหม

	g.Expect(err).ToNot(BeNil()) //เช็คว่ามันว่างไหม

	g.Expect(err.Error()).To(Equal("Phone must be 10 Digit")) //ส่ง error ms

}

func TestDateAttendanceNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	attendance := Attendance{
		Phone:       "0987654321",
		Description: "aaa",
		Datetime:    time.Now().Add(time.Minute * -100), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(attendance)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the past"))
}

func TestDateAttendanceNotBeFuture(t *testing.T) {
	g := NewGomegaWithT(t)

	attendance := Attendance{
		Phone:       "0987654321",
		Description: "aaa",
		Datetime:    time.Now().Add(time.Minute * +100), // อดีตผิด วันที่เวลาต้องไม่เป็นอนาคต
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(attendance)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Date must not be in the future"))
}
