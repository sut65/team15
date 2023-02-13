import { PrescriptionInterface } from "./IPrescription";
import { PaymentmethodsInterface } from "./IPaymentmethod";
import { UserInterface } from "./IUser";

export interface BillsInterface {
  ID: string,
  BillNo:number,
  BillTime: Date  | null ,
  Payer:string,
  Total:number,
  
  PrescriptionID: number,
  Prescription: PrescriptionInterface,

  PaymentmethodID: number,
  Paymentmethod: PaymentmethodsInterface,

  PharmacistID: number,
  Pharmacist:   UserInterface,
}
