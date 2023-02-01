import { DispenseMedicineInterface } from "./IDispenseMedicine";
import { SatffInterface } from "./IStaff";
import { UserInterface } from "./IUser";
export interface ReturnInterface {
    ID: number,
    Reason: string,
    ReturnDate: Date | null,
  
    PharmacistID: number,
    Pharmacist: UserInterface,
  
    DispenseMedicineID: number,
    DispenseMedicine: DispenseMedicineInterface,
  
    StaffID: number,
    Staff: SatffInterface,
}