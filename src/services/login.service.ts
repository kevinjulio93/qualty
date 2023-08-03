import { FecthRequestModel } from "../models/request.model";

const login = FecthRequestModel.getInstance();

export async function userLogin(credentials: any) {
    const response = await login.post('/users/login', credentials, true);
    return response;
}
