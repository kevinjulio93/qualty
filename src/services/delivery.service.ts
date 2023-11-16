import { FecthRequestModel } from "../models/request.model";

const delivery = FecthRequestModel.getInstance();

export async function createDelivery(item:any) {
    const response = await delivery.post('/deliverys', item);
    return response;
}

export async function updateDelivery(id) {
    const response = await delivery.put(`/deliverys/${id}`, {});
    return response;
}

export async function getPdfDeliveryBeneficiarie(idEvent:string,idBeneficiarie:string) {
  const response = await delivery.getBlobWithParams(`/deliverys/pdf/${idEvent}/${idBeneficiarie}`,);
  return response;
  /**
   Esta respuesta da un blob a continuacion 
   dejo un codigo que reciebiendo el blob descarga el archivo automaticamente :

    const responseRequest=await getPdfDeliveryBeneficiarie(arg1,arg2);
    const blob = await responseRequest.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "delivery__"+Date.now()+"_.pdf";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
   */
}

export async function getAllDelivery(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await delivery.get("/deliverys/?" + params);
    return response;
  }

  export async function getAllDeliveryByRep(
    queryString?: string,
    page: number = 1,
    perPage: number = 20,
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await delivery.get(`/deliverys/type/representant/?${params}`);
    return response;
  }

  export async function getAllDeliveryByBen(
    queryString?: string,
    page: number = 1,
    perPage: number = 20,
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await delivery.get(`/deliverys/type/beneficiary/?${params}`);
    return response;
  }


export async function deleteDelivery(id: string) {
    const response = await delivery.delete(`/deliverys/${id}`);
    return response;
}

export async function getDeliveryById(id:string) {
  const response= await delivery.get("/deliverys/"+id);
  return response;
}

export async function getDeliveryPdf(id:string) {
  const response= await delivery.get("/deliverys/pdf/"+id);
  return response;
}