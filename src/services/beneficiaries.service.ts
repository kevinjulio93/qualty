
import { FecthRequestModel } from "../models/request.model";


const requestInstance = FecthRequestModel.getInstance();

export async function  createBeneficiary(file: any, data: any) {
    const beneficiary = JSON.stringify(data);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', beneficiary);
    const response = await requestInstance.post('/beneficiaries', formData, false, true);
    return response
}

export async function  updateBeneficiary(file: any, data: any) {
    const beneficiary = JSON.stringify(data);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', beneficiary);
    const response = await requestInstance.put(`/beneficiaries/${data._id}`, formData, false, true);
    return response
}

export async function getBeneficiariesList() {
    const response = await requestInstance.get('/beneficiaries');
    return response
}

export async function getBeneficiarieById(id:string|undefined) {
    const response = await requestInstance.get(`/beneficiaries/${id}`);
    return response
}

export async function deleteBeneficiary(id:string|undefined) {
    const response = await requestInstance.delete(`/beneficiaries/${id}`);
    return response
}