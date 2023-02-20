
import { StattInterface } from "./IStatt";
import { ShiftInterface } from "./IShift";
import { UserInterface } from "./IUser";

export interface AttendanceInterface {

    
    ID: number,
    Phone: string,
    Description: number,
    Datetime: Date | null,

    PharmacistID: number,
    Pharmacist: UserInterface,

    StattID: number,     // company
    Statt: StattInterface,

    ShiftID: number,        // unit
    Shift: ShiftInterface,

    // ID: number,
    // Phone: string,
    // Description: string,
    // Datetime: Date | null,
}
// Quantity = Phone
// Priceperunit = Description