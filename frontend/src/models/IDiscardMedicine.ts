import { MedicineReceiveInterface } from "./IMedicineReceive";
import { Causeinterface } from "./ICause";
import { UserInterface } from "./IUser";


export interface DiscardmedicineInterface {

    ID: number,
    Note: string,
    Quantity: number,
    Datetime: Date | null,

    CauseID: number,
    Cause: Causeinterface,

    PharmacistID: number,
    Pharmacist: UserInterface,

    MedicineReceiveID: number,
    MedicineReceive: MedicineReceiveInterface,

}