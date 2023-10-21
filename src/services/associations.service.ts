import { FecthRequestModel } from "../models/request.model";

const associationRequest = FecthRequestModel.getInstance();

export async function createAssociation(association: any) {
  const response = await associationRequest.post("/associations", association);
  return response;
}

export async function updateAssociation(association: any) {
  const response = await associationRequest.put(
    "/associations/" + association._id,
    association
  );
  return response;
}

export async function getAssociationsList(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await associationRequest.get("/associations/?" + params);
  return response;
}

export async function deleteAssociation(id: string) {
  const response = await associationRequest.delete("/associations/" + id);
  return response;
}
