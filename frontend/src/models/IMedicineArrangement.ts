import { ClassifydrugsInterface } from "./IClassifydrugs";
import { PrescriptionInterface } from "./IPrescription";
import { UserInterface } from "./IUser";

export interface MedicineArrangementInterface {

    ID: number,

    MedicineArrangementNo: number,
    Note: string,
    MedicineArrangementTime: Date | null,

    PharmacistID: number,
    Pharmacist:   UserInterface,

    ClassifyDrugsID: number,
    ClassifyDrugs:      ClassifydrugsInterface,

    PrescriptionID: number,
    Prescription: PrescriptionInterface

}