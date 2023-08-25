import { FecthRequestModel } from "../models/request.model";

const roles = FecthRequestModel.getInstance();

export async function createRole(role: any) {
    const response = await roles.post('/roles', role);
    return response;
}

export async function updateRole(role: any) {
    const response = await roles.put('/roles', role);
    return response;
}

export async function getAllroles() {
    const response = await roles.get('/roles');
    return response;
}


export async function deleteRole(role: any) {
    const response = await roles.delete(`/roles/${role.id}`);
    return response;
}




