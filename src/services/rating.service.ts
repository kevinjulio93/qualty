import { typeBodyRequestPdf } from "../constants/ratings";
import { FecthRequestModel } from "../models/request.model";

const ratings = FecthRequestModel.getInstance();

export const getFilePdfRatings=async (body:typeBodyRequestPdf)=>{
    //Esta respuesta devuelve un Blob
    const response = await ratings.getBlob('/ratings/pdf',body);
    return response;
}