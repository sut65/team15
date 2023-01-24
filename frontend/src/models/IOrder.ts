import { CompanyInterface } from "./ICompany";
import { MedicineInterface } from "./IMedicine";
import { UnitInterface } from "./IUnit";
import { UserInterface } from "./IUser";

export interface OrderInterface {

    ID: number,
    Quantity: number,
    Priceperunit: number,
    Datetime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,

    MedicineID: number,
    Medicine: MedicineInterface,

    UnitID: number,
    Unit: UnitInterface,

    CompanyID: number,
    Company: CompanyInterface,
}