
/** data associated with a user */

export interface UserData {
    id: string;
    name: string;
    email: string;
    bankAccountHolder: string;
    bankAccountNo: number;
    bankSortCode: string;
}

/** Creates new user data */
export function createUserData(): UserData {
    const userdata: UserData = {
        id: "",
        name: "",
        email: "",
        bankAccountHolder: "",
        bankAccountNo: 0,
        bankSortCode: "",
    };
    return userdata;
}