package entity

import (
	"testing"
	"time"
	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"

)

func TestDataDispenseMedicineCorrect(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check data is validate", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		100000,
			ReceiveName:		"แสนดี มากมาย"	,	                 		
			DispenseTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(dispense)
		g.Expect(ok).To(BeTrue())
		g.Expect(err).To(BeNil())
	})
}

func TestNoteDispenseMedicineNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check ReceiveName not blank", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		200000,
			ReceiveName:		""	,	//ผิด                		
			DispenseTime:	time.Now(),
		}
		ok, err := govalidator.ValidateStruct(dispense)
		g.Expect(ok).NotTo(BeTrue())			
		g.Expect(err).ToNot(BeNil())			
		g.Expect(err.Error()).To(Equal("ReceiveName cannot be blank"))
	})
}

func TestNoDispenseMedicine1(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern DispenseNo number 6 digit", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		1000,	//ผิด	
			ReceiveName:		"แสนดี มากมาย"	,	                  		
			DispenseTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(dispense)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("DispenseNo dose not validate as matches(^\\d{6}$)"))
	})
}

func TestNoDispenseMedicine2(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern DispenseNo non zero", func(t *testing.T) {
		dispense := DispenseMedicine{
			DispenseNo: 		0,		//ผิด
				ReceiveName:		"แสนดี มากมาย"	,	                  		
				DispenseTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(dispense)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("DispenseNo: non zero value required"))
	})
}

func TestNoDispenseMedicine3(t *testing.T) {
	g := NewGomegaWithT(t)
	t.Run("check pattern DispenseNo range 100000|999999", func(t *testing.T) {
		dispense := DispenseMedicine{
				DispenseNo: 		1000,		//ผิด
				ReceiveName:		"แสนดี มากมาย"	,	                  		
				DispenseTime:	time.Now(),
			}

			ok, err := govalidator.ValidateStruct(dispense)
			g.Expect(ok).NotTo(BeTrue())			
			g.Expect(err).ToNot(BeNil())			
			g.Expect(err.Error()).To(Equal("DispenseNo: range 100000|999999"))
	})
}