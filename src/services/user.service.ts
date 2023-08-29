
import { FecthRequestModel } from "../models/request.model";
import { AppUser } from "../models/user.model";


const userRequest = FecthRequestModel.getInstance();

export async function createUser(user: AppUser) {
    const response = await userRequest.post('/users', user);
    return response
}

export async function updateUser(user: AppUser) {
    const response = await userRequest.put('/users/' + user._id, user);
    return response
}

export async function getUserList() {
    const response = await userRequest.get('/users');
    return response
}

export async function deleteUser(id: string) {
    const response = await userRequest.delete('/users/' + id);
    return response
}