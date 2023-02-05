import { DispenseMedicineInterface } from "./IDispenseMedicine";
import { SatffInterface } from "./IStaff";
import { ReasonInterface } from "./IReason";
import { UserInterface } from "./IUser";
export interface ReturnInterface {
    ID: number,

    ReturnDate: Date | null,
  
    PharmacistID: number,
    Pharmacist: UserInterface,
  
    DispenseMedicineID: number,
    DispenseMedicine: DispenseMedicineInterface,
  
    StaffID: number,
    Staff: SatffInterface,

    ReasonID: number,
    Reason: ReasonInterface,
}