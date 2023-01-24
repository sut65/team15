import { RoleInterface } from "./IRole";

export interface UserInterface {

    ID: number,
    Name: string,
    UserName: string,
    Password: string,

    RoleID: number,
    Role: RoleInterface,
}