import { FecthRequestModel } from "../models/request.model";

const workshop = FecthRequestModel.getInstance();

export const getFilePdfAttendeesWorkshop=async (idWorkshop:string)=>{
    //Esta respuesta devuelve un Blob
    const response = await workshop.getBlob('/workshops/pdf/'+idWorkshop);
    return response;
}