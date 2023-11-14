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


export async function deleteDelivery(id: string) {
    const response = await delivery.delete(`/deliverys/${id}`);
    return response;
}

export async function getDeliveryById(id:string) {
  const response= await delivery.get("/deliverys/"+id);
  return response;
}