import { DispenseMedicineInterface } from "./IDispenseMedicine";
import { SatffInterface } from "./IStaff";
import { ReasonInterface } from "./IReason";
import { UserInterface } from "./IUser";
import { OrderInterface } from "./IOrder";

export interface ReturnInterface {
    ID: number,

    Note: string,

    Unitt: string,

    ReturnDate: Date | null,
  
    PharmacistID: number,
    Pharmacist: UserInterface,
  
    DispenseMedicineID: number,
    DispenseMedicine: DispenseMedicineInterface,
  
    StaffID: number,
    Staff: SatffInterface,

    OrderID: number,
    Order: OrderInterface,

    ReasonID: number,
    Reason: ReasonInterface,
}