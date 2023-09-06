
import { FecthRequestModel } from "../models/request.model";


const requestInstance = FecthRequestModel.getInstance();

export async function  createBeneficiary(file, data) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', data);
    console.log(formData.getAll('file'))
    const response = await requestInstance.post('/beneficiaries', formData);
    return response
}

export async function getBeneficiariesList() {
    const response = await requestInstance.get('/beneficiaries');
    return response
}