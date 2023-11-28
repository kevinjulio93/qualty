import { REPORT_TYPE } from "../constants/reportType";
import { FecthRequestModel } from "../models/request.model";

const workshop = FecthRequestModel.getInstance();

export async function createWorkshop(item:any) {
    const response = await workshop.post('/workshops', item);
    return response;
}

export async function updateWorkshop(id, item:any) {
    const response = await workshop.put(`/workshops/${id}`, item);
    return response;
}

export async function getAllWorkshops(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await workshop.get("/workshops/?" + params);
    return response;
  }


export async function deleteWorkshop(id: string) {
    const response = await workshop.delete(`/workshops/${id}`);
    return response;
}

export async function getWorkshopById(workId: any) {
  const response = await workshop.get(`/workshops/${workId}`);
  return response;
}

export const getFilePdfAttendeesWorkshop=async (idWorkshop:string)=>{
    //Esta respuesta devuelve un Blob
    const response = await workshop.getBlob('/workshops/pdf/'+idWorkshop);
    return response;
}

export const getWorkshopListPdf=async (body:any, selectedReport: string)=>{

  try {
    const url = selectedReport === REPORT_TYPE.GENERAL_WORKSHOPS_SUMMARY ? `/workshops/general/pdf` : `/workshops/pdf`;
    const response = await workshop.getBlob(url,body);

    const blob =  response.result;
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "lista_de_talleres"+Date.now()+"_.pdf";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}