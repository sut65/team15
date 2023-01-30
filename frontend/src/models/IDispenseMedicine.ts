import { PharmacyInterface } from "./IPharmacy";
import { UserInterface } from "./IUser";

export interface DispenseMedicineInterface {

    ID: number,

    DispenseNo: number,
    ReceiveName: string,
    DispenseTime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,

    PharmacyID: number,
    Pharmacy:   PharmacyInterface,

}