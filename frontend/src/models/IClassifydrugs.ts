import { CupboardInterface } from "./ICupboard";
import { ZoneeInterface } from "./IZonee";
import { FloorInterface } from "./IFloor";
import { UserInterface } from "./IUser";
import { MedicineDisbursementInterface } from "./IMedicineDisbursement";

export interface ClassifydrugsInterface {

    ID: number,
    Number: number,
    Note: string,
    Datetime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,

    CupboardID: number,
    Cupboard: CupboardInterface,

    ZoneeID: number,
    Zonee: ZoneeInterface,

    FloorID: number,
    Floor:  FloorInterface,

    MedicineDisbursementID: number,
    MedicineDisbursement: MedicineDisbursementInterface,
}