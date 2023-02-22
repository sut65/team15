package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestMedicineDisbursementUsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		medicineDisbursement := MedicineDisbursement{
			MedicineDisNo: "C205",
			MedicineDisAmount: 100,
			Dtime:      time.Now(),
		}
		ok, err := govalidator.ValidateStruct(medicineDisbursement)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})

}

func TestNotMedicineDisbursementUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)

	MedicineDisNo := []string{
		"",
		"C1",
		"C1234",
		"C12",
	}
	for _, o := range MedicineDisNo{
		medicineDisbursement := MedicineDisbursement{
			MedicineDisNo: o,
			MedicineDisAmount: 100,
			Dtime:      time.Now(),
		}

		ok, err := govalidator.ValidateStruct(medicineDisbursement)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("MedicineDisNo must be C then 3 digit"))
	}
}