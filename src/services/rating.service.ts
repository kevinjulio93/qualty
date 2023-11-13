import { typeBodyRequestPdf } from "../constants/ratings";
import { FecthRequestModel } from "../models/request.model";

const ratings = FecthRequestModel.getInstance();

export async function createRatings(item:any) {
    const response = await ratings.post('/ratings', item);
    return response;
}

export async function updateCurrentRating(item:any) {
    const response = await ratings.put(`/ratings/${item._id}`, item);
    return response;
}

export async function getAllRatings(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await ratings.get("/ratings/?" + params);
    return response;
  }


export async function deleteRatings(id: string) {
    const response = await ratings.delete(`/ratings/${id}`);
    return response;
}

export async function getRatingsById(ratingId: any) {
  const response = await ratings.get(`/ratings/${ratingId}`);
  return response;
}

export const getFilePdfRatings=async (body:typeBodyRequestPdf)=>{
    //Esta respuesta devuelve un Blob
    const response = await ratings.getBlob('/ratings/pdf',body);
    return response;
}

export async function getRatingsByBeneficiary(beneficiryId: any) {
  const response = await ratings.get(`/ratings/beneficiary/${beneficiryId}`);
  return response;
}