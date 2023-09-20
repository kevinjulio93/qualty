import { FecthRequestModel } from "../models/request.model";

const roles = FecthRequestModel.getInstance();

export async function createRole(role: any) {
  const response = await roles.post("/roles", role);
  return response;
}

export async function updateRole(role: any) {
  const response = await roles.put("/roles/" + role._id, role);
  return response;
}

export async function getAllroles(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await roles.get("/roles/?" + params);
  return response;
}

export async function deleteRole(id: any) {
  const response = await roles.delete(`/roles/${id}`);
  return response;
}
