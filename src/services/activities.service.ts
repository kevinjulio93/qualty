import { putElementAtFirst } from "../helpers/putElementAtFirst";
import { FecthRequestModel } from "../models/request.model";

const activity = FecthRequestModel.getInstance();

export async function createActivities(activities:any) {
    const response = await activity.post('/activities', activities);
    return response;
}

export async function getActivitybyId(activityId: any) {
    const response = await activity.get(`/activities/${activityId}`);
    return response;
}

export async function updateActivities(activityId:string, activities:any) {
    const response = await activity.put(`/activities/${activityId}`, activities);
    return response;
}

export async function updateAttendance(id: string, info :any) {
    const response = await activity.put('/activities/' + id, info);
    return response;
}

export async function getAllActivities(
    queryString?: string,
    page: number = 1,
    perPage: number = 20
  ) {
    const params = `page=${page}&perPage=${perPage}${
      queryString ? `&queryString=${queryString}` : ""
    }`;
    const response = await activity.get("/activities/?" + params);
    return response;
  }


export async function deleteActivities(activityId: any) {
    const response = await activity.delete(`/activities/${activityId}`);
    return response;
}

export async function getDepartments() {
    const request = await fetch('https://api-colombia.com/api/v1/Department');
    const departments = await request.json();

    return putElementAtFirst(departments, "id", 23);
}

export async function getMunicipies(departmentId:string) {
    const request = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
    const municipies = await request.json()
    return putElementAtFirst(municipies, "id", 870);
}

export async function getPdfAssistanceActivity(act_id: any) {
    try {
      const url = `/activities/pdf-assistance/${act_id}`;
      const response = await activity.getBlobWithParams(url);
  
      const blob =  response.result;
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "Asistentes_actividad__"+Date.now()+"_.pdf";
      a.style.display = "none";
  
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  }

export async function getComunaByMunicipie(municipalityId:string) {
    const response = await activity.get(`/references/communities?municipality_id=${municipalityId}`);
    return response;
}

export async function getAssociationsByCommunity(idcommunity:string) {
    const response = await activity.get(`/references/associations?community=${idcommunity}`);
    return response;
}
