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

//ในช่วง 1-1000
func TestMedicineDisAmountnotbeBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	k := []uint{
		0,
		1001,
	}

	for _, ku := range k {
		medicineDisbursement := MedicineDisbursement{

			MedicineDisNo: "C555",
			MedicineDisAmount: ku,
			Dtime:      time.Now(),
		}
		// ตรวจสอบด้วย govalidator
		ok, err := govalidator.ValidateStruct(medicineDisbursement)

	g.Expect(ok).ToNot(BeTrue()) 

	g.Expect(err).ToNot(BeNil()) 

	g.Expect(err.Error()).To(Equal("The MedicineDisAmount must be in the range 1-1000")) 

	}

}

//เวลา
func TestMedicineDisbursementUNnsable(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check Dtime unsable", func(t *testing.T) {
		medicineDisbursement := MedicineDisbursement{
			MedicineDisNo: "C205",
			MedicineDisAmount: 100,
			Dtime:      time.Now().Add(time.Minute * -5), // ต้องเป็นปัจจุบัน
		}

		ok, err := govalidator.ValidateStruct(medicineDisbursement)
		g.Expect(ok).NotTo(BeTrue())
		g.Expect(err).ToNot(BeNil())
		g.Expect(err.Error()).To(Equal("Dtime unsable"))
	})
}