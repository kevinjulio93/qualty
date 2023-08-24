import { FecthRequestModel } from "../models/request.model";

const login = FecthRequestModel.getInstance();

export async function userLogin(credentials: any) {
    const response = await login.post('/auth/login', credentials, true);
    return response;
}


