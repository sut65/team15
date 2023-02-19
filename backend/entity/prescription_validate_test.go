package entity

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

)

func TestDataPrescriptionCorrect(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		prescription := Prescription{
			Number: 		10000,
			Note:			"สั่งยาแล้ว"	,	                 		
			Datetime:		time.Now(),
		}
		ok, err := govalidator.ValidateStruct(prescription)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestNotePrescriptionNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check note not blank", func(t *testing.T) {
		prescription := Prescription{
			Number: 		10000,
			Note:			""	,	//ผิด                		
			Datetime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(prescription)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("Note cannot be blank"))
	})
}

func TestNoPrescription1(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern number non zero", func(t *testing.T) {
			prescription := Prescription{
				Number: 		0,		//ผิด
				Note:			"สั่งยาแล้ว"	,	                  		
				Datetime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(prescription)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("Number: non zero value required"))
	})
}

func TestNoPrescription2(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern number range 10000|99999", func(t *testing.T) {
			prescription := Prescription{
				Number: 		200000,		//ผิด
				Note:			"สั่งยาแล้ว"	,	                  		
				Datetime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(prescription)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("Number: range 10000|99999"))
	})
}

func TestPrescriptionNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check PrescriptionTime not be past", func(t *testing.T) {
			prescription := Prescription{
				Number: 		10000,		
				Note:			"สั่งยาแล้ว"	,	                  		
				Datetime: time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
			}

			ok, err := govalidator.ValidateStruct(prescription)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("DateTime not be past"))
	})
}