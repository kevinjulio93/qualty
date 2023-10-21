import { FecthRequestModel } from "../models/request.model";

const workshop = FecthRequestModel.getInstance();

export async function createWorkshop(item:any) {
    const response = await workshop.post('/workshops', item);
    return response;
}

export async function updateWorkshop(item:any) {
    const response = await workshop.put('/workshops', item);
    return response;
}

export async function getAllWorkshops() {
    const response = await workshop.get('/workshops');
    return response;
}


export async function deleteWorkshop(item: any) {
    const response = await workshop.delete(`/workshops/${item.id}`);
    return response;
}

export const getFilePdfAttendeesWorkshop=async (idWorkshop:string)=>{
    //Esta respuesta devuelve un Blob
    const response = await workshop.getBlob('/workshops/pdf/'+idWorkshop);
    return response;
}