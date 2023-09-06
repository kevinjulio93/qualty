
import { FecthRequestModel } from "../models/request.model";


const requestInstance = FecthRequestModel.getInstance();

export async function  createBeneficiary(file: any, data: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', data);
    const response = await requestInstance.post('/beneficiaries', formData, false, true);
    return response
}

export async function getBeneficiariesList() {
    const response = await requestInstance.get('/beneficiaries');
    return response
}