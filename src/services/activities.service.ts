import { FecthRequestModel } from "../models/request.model";

const activity = FecthRequestModel.getInstance();

export async function createActivities(activities:any) {
    const response = await activity.post('/activities', activities);
    return response;
}

export async function updateActivities(activities:any) {
    const response = await activity.put('/activities', activities);
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




