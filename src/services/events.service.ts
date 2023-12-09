import { FecthRequestModel } from "../models/request.model";

const events = FecthRequestModel.getInstance();

export const getPdfEventSummary=async (id:string)=>{
  try {
    const url = `/events/pdf-items-delivered/`+ id;
    const response = await events.getBlobWithParams(url);

    const blob =  response.result;
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "Artículos_entregados_en_el_evento__"+Date.now()+"_.pdf";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}

export const getPdfEventAssistance=async (id:string)=>{
  try {
    const url = `/events/pdf-assistance/`+ id;
    const response = await events.getBlobWithParams(url);

    const blob =  response.result;
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "asistencia_evento__"+Date.now()+"_.pdf";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}

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

export async function getAllEventsByType(
  queryString?: string,
  page: number = 1,
  perPage: number = 20,
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

export async function removeAssitance(id:string,data: any) {
  const response = await events.put("/events/remove/" + id, data);
  return response;
}
