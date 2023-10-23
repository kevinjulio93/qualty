import { FecthRequestModel } from "../models/request.model";

const item = FecthRequestModel.getInstance();

export async function getAllItems(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await item.get("/items/?" + params);
    return response;
  }

export async function createItem(bodyItem: any) {
    const response = await  item.post("/items",bodyItem);
    return response;
}

export async function updateItem(bodyItem: any) {
    const response = await item.put("/items/" + bodyItem._id, bodyItem);
    return response;
}

export async function deleteItem(id: any) {
    const response = await item.delete(`/items/${id}`);
    return response;
}
