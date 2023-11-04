import { FecthRequestModel } from "../models/request.model";

const delivery = FecthRequestModel.getInstance();

export async function createPhysicalDelivery(data:any) {
    const response = await delivery.post('/physicalDelivery', data);
    return response;
}

export async function updatePhysicalDelivery(item:any) {
    const response = await delivery.put('/physicalDelivery/'+item?._id, item);
    return response;
}

export async function getAllPhysicalDelivery(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await delivery.get("/physicalDelivery/?" + params);
    return response;
  }


export async function getOnePhysicalDelivery(id: string) {
    const response = await delivery.get(`/physicalDelivery/${id}`);
    return response;
}

export async function deletePhysicalDelivery(id: string) {
    const response = await delivery.delete(`/physicalDelivery/${id}`);
    return response;
}