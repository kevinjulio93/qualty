import { FecthRequestModel } from "../models/request.model";

const representativeRequest = FecthRequestModel.getInstance();

export async function createRepresentative(representative: any) {
  const response = await representativeRequest.post(
    "/representants",
    representative
  );
  return response;
}

export async function updateRepresentative(representative: any) {
  const response = await representativeRequest.put(
    "/representants/" + representative._id,
    representative
  );
  return response;
}

export async function getRepresentativesList(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await representativeRequest.get("/representants/?" + params);
  return response;
}

export async function deleteRepresentative(id: string) {
  const response = await representativeRequest.delete("/representants/" + id);
  return response;
}
