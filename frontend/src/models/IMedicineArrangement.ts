import { UserInterface } from "./IUser";

export interface MedicineArrangementInterface {

    ID: number,

    MedicineArrangementNo: number,
    Note: string,
    MedicineArrangementTime: Date | null,

    PharmacistID: number,
    Pharmacist:   UserInterface,

}