package entity

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

)

func TestDataClassifyDrugsCorrect(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		classifydrugs := ClassifyDrugs{
			Number: 		30000,
			Note:			"จัดชั้นยาแล้ว"	,	                 		
			// Datetime:		time.Now(),
		}
		ok, err := govalidator.ValidateStruct(classifydrugs)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestNoteClassifyDrugsNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check note not blank", func(t *testing.T) {
		classifydrugs := ClassifyDrugs{
			Number: 		30000,
			Note:			""	,	//ผิด                		
			// Datetime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(classifydrugs)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("Note cannot be blank"))
	})
}

func TestNoClassifyDrugs1(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern number non zero", func(t *testing.T) {
			classifydrugs := ClassifyDrugs{
				Number: 		0,		//ผิด
				Note:			"จัดชั้นยาแล้ว"	,	                  		
				// Datetime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(classifydrugs)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("Number: non zero value required"))
	})
}

func TestNoClassifyDrugs2(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern number range 30000|99999", func(t *testing.T) {
			classifydrugs := ClassifyDrugs{
				Number: 	10000,		//ผิด
				Note:		"จัดชั้นยาแล้ว"	,	                  		
				// Datetime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(classifydrugs)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("Number: range 30000|99999"))
	})
}

func TestClassifyDrugsNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check ClassifyDrugs not be past", func(t *testing.T) {
			classifydrugs := ClassifyDrugs{
				Number: 		30000,		
				Note:			"จัดชั้นยาแล้ว"	,	                  		
				Datetime: time.Now().Add(time.Minute * -10), // อดีตผิด วันที่เวลาต้องไม่เป็นอดีต
			}

			ok, err := govalidator.ValidateStruct(classifydrugs)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("DateTime not be past"))
	})
}