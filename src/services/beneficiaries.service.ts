
import { FecthRequestModel } from "../models/request.model";


const requestInstance = FecthRequestModel.getInstance();

export async function  createBeneficiary(data) {
    const response = await requestInstance.post('/beneficiaries', data, true);
    return response
}

export async function getBeneficiariesList() {
    const response = await requestInstance.get('/beneficiaries');
    return response
}