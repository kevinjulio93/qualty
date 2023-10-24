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

export async function getAllActivities() {
    const response = await activity.get('/activities');
    return response;
}


export async function deleteActivities(activities: any) {
    const response = await activity.delete(`/activities/${activities.id}`);
    return response;
}

export async function getDepartments() {
    const request = await fetch('https://api-colombia.com/api/v1/Department');
    const departments = await request.json()
    return departments;
    
}

export async function getMunicipies(departmentId:string) {
    const request = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
    const municipies = await request.json()
    return municipies;
}

export async function getComunaByMunicipie(municipalityId:string) {
    const response = await activity.get(`/references/communities?municipality_id=${municipalityId}`);
    return response;
}

export async function getAssociationsByCommunity(idcommunity:string) {
    const response = await activity.get(`/references/associations?community=${idcommunity}`);
    return response;
}

export async function getDepartments() {
    const request = await fetch('https://api-colombia.com/api/v1/Department');
    const departments = await request.json()
    return departments;
    
}

export async function getMunicipies(departmentId:string) {
    const request = await fetch(`https://api-colombia.com/api/v1/Department/${departmentId}/cities`);
    const municipies = await request.json()
    return municipies;
}

export async function getComunaByMunicipie(municipalityId:string) {
    const response = await activity.get(`/references/communities?municipality_id=${municipalityId}`);
    return response;
}

export async function getAssociationsByCommunity(idcommunity:string) {
    const response = await activity.get(`/references/associations?community=${idcommunity}`);
    return response;
}



