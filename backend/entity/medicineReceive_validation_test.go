package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMedicineReceiveUsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		medicineReceive := MedicineReceive{
			MedicineReceiveNo: 8008,
			RecievedDate:      time.Now(),
		}
		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}

func TestNoMedicineReceiveUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern number range 1000|9999", func(t *testing.T) {
		medicineReceive := MedicineReceive{
			MedicineReceiveNo: 808, // ต้องเป็นเลข 4 ตัว
			RecievedDate:      time.Now(),
		}

		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Number: range 1000|9999"))
	})
}

func TestMedicineReceiveUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check RecievedDate unsable", func(t *testing.T) {
		medicineReceive := MedicineReceive{
			MedicineReceiveNo: 1000,
			RecievedDate:      time.Now().Add(time.Minute * -5), // ต้องเป็นปัจจุบัน
		}

		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("RecievedDate unsable"))
	})
}
