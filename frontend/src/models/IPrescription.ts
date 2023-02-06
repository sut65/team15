import { PatientInterface } from "./IPatient";
import { UserInterface } from "./IUser";

export interface PrescriptionInterface {

    ID: number,
    Number: number,
    Note: string,
    Datetime: Date | null,

    DoctorID: number,
    Doctor: UserInterface,

    PatientID: number,
    Patient: PatientInterface,

}