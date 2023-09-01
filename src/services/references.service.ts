
import { FecthRequestModel } from "../models/request.model";


const references = FecthRequestModel.getInstance();


export async function getReferences() {
    const response = await references.get('/references');
    return response
}