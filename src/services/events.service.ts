import { FecthRequestModel } from "../models/request.model";

const events = FecthRequestModel.getInstance();

export async function createEvent(event: any) {
  const response = await events.post("/events", event);
  return response;
}

export async function updateEvent(id:string,data: any) {
  const response = await events.put("/events/" + id, data);
  return response;
}

export async function getAllEvents(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await events.get("/events/?" + params);
  return response;
}

export async function getEventById(id:string) {
  const response= await events.get(`/events/${id}`);
  return response;
}

export async function deleteEvent(id: string) {
  const response = await events.delete(`/events/${id}`);
  return response;
}

export async function getEventStats(id: string) {
  const response = await events.get(`/events/stats/${id}`);
  return response;
}
