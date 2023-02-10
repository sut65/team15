import { MedicineRoomInterface } from "./IMedicineRoom";
import { UserInterface } from "./IUser";
import { MedicineReceiveInterface } from "./IMedicineReceive";

export interface MedicineDisbursementInterface {

    ID: number,
    MedicineDisNo: number,
    
    Dtime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,


    MedicineRoomID: number,
	MedicineRoom: MedicineRoomInterface,

    MedicineReceiveID: number,
    MedicineReceive: MedicineReceiveInterface,


}