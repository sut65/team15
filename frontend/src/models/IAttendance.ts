
import { StatInterface } from "./IStat";
import { ShiftInterface } from "./IShift";
import { UserInterface } from "./IUser";

export interface AttendanceInterface {

    ID: number,
    Phone: string,
    Description: string,
    Datetime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,

    StatID: number,
    Stat: StatInterface,

    ShiftID: number,
    Shift: ShiftInterface,

    
}