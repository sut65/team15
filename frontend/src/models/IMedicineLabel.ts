import { OrderInterface } from "./IOrder";
import { SuggestionsInterface } from "./ISuggestion";
import { EffectsInterface } from "./IEffect";
import { UserInterface } from "./IUser";
export interface MedicineLabelsInterface {
  ID: number,
  Instruction: string,
  Property: string,
  Consumption: number,
  Date: Date,

  PharmacistID: number,
  Pharmacist: UserInterface,

  OrderID: number,
  Order: OrderInterface,

  SuggestionID: number,
  Suggestion: SuggestionsInterface,

  EffectID: number,
  Effect: EffectsInterface,
}