import { typeBodyRequestPdf } from "../constants/ratings";
import { REPORT_TYPE } from "../constants/reportType";
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

export const getFilePdfRatings=async (body:any, selectedReport: string)=>{

    try {
      const url = selectedReport === REPORT_TYPE.GENERAL_RATINGS_SUMMARY ? `/ratings/general/pdf` : `/ratings/pdf`;
      const response = await ratings.getBlob(url,body);
  
      const blob =  response.result;
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "lista_de_valoraciones"+Date.now()+"_.pdf";
      a.style.display = "none";
  
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
}

export async function getRatingsByBeneficiary(beneficiryId: any) {
  const response = await ratings.get(`/ratings/beneficiary/${beneficiryId}`);
  return response;
}