import { FecthRequestModel } from "../models/request.model";

const winerie = FecthRequestModel.getInstance();

export async function createWinerie(dataWinerie: any) {
  const response = await winerie.post("/wineries", dataWinerie);
  return response;
}

export async function updateWinerie(id:string,data: any) {
  const response = await winerie.put("/wineries/" + id, data);
  return response;
}

export async function getAllWineries(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await winerie.get("/wineries/?" + params);
  return response;
}

export async function getWinerie(id:string) {
  const response=await winerie.get("/wineries/"+id);
  return response;
}

export async function deleteWinerie(id: any) {
  const response = await winerie.delete(`/wineries/${id}`);
  return response;
}

export async function closeWinerie(id:string) {
  const response = await winerie.put("/wineries/close/" + id, null);
  return response;
}
