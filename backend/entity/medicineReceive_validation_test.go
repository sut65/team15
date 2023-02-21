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
			MedicineReceiveNo: "B25430",
			RecievedDate:      time.Now(),
		}
		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}

func TestNoMedicineReceiveUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)

	MedicineReceiveNo := []string{
		"",
		"B1",
		"B1",
		"B123",
		"B1234",
		"B12",
	}
	for _, o := range MedicineReceiveNo{
		medicineReceive := MedicineReceive{
			MedicineReceiveNo: o,
			RecievedDate:      time.Now(),
		}

		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("MedicineReceiveNo must be B then 5 digit"))
	}
}

func TestMedicineReceiveUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check RecievedDate unsable", func(t *testing.T) {
		medicineReceive := MedicineReceive{
			MedicineReceiveNo: "B25430",
			RecievedDate:      time.Now().Add(time.Minute * -5), // ต้องเป็นปัจจุบัน
		}

		ok, err := govalidator.ValidateStruct(medicineReceive)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("RecievedDate unsable"))
	})
}
