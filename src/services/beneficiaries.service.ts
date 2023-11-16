import { FecthRequestModel } from "../models/request.model";

const requestInstance = FecthRequestModel.getInstance();

export async function createBeneficiary(files: any, data: any) {
  // const beneficiary = JSON.stringify(data);
  // const formData = new FormData();
  // formData.append("file", file);
  // formData.append("data", beneficiary);
  const beneficiary = data;
  const bodyBen={data:{...beneficiary}};
  const response = await requestInstance.post(
    "/beneficiaries",
    bodyBen,
    false,
    false
  );
  if(response.status===200){
    if(files.length > 0){
      const promises = await saveAllFiles(files, response.result.data._id);
      Promise.all(promises).then((responses) => {
        return responses;
      });
    }
  }
  return response;
}

const saveAllFiles = (files, idben) => {
  return files.map(async (item, index) => {
    const formData = getFormData(item);
      const responsePhoto = await requestInstance.post(
        "/beneficiaries/resources/"+idben,
        formData,
        false,
        true
      );
      return responsePhoto
  });
}



  const getFormData = (file) => {
    const formData = new FormData();
    const keys = Object.keys(file);
    formData.append(keys[0], file[`${keys[0]}`]);
    return formData;
  };

export async function updateBeneficiary(files: any, data: any) {
  // const beneficiary = JSON.stringify(data);
  // const formData = new FormData();
  // formData.append("file", file);
  // formData.append("data", beneficiary);
  const response = await requestInstance.put(
    `/beneficiaries/${data._id}`,
    data,
    false,
    false
  );
  if(response.status===200){
    if(files.length > 0){
      const promises = await saveAllFiles(files, response.result.data._id);
      Promise.all(promises).then((responses) => {
        return responses;
      });
    }
  }
  return response;
}

export async function getBeneficiariesList(
  queryString?: string,
  page: number = 1,
  perPage: number = 20

) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await requestInstance.get("/beneficiaries/?" + params);
  return response;
}

export async function getBeneficiarieById(id: string | undefined) {
  const response = await requestInstance.get(`/beneficiaries/${id}`);
  return response;
}

export async function deleteBeneficiary(id: string | undefined) {
  const response = await requestInstance.delete(`/beneficiaries/${id}`);
  return response;
}

export async function getBeneficiaryByActivity(
  actId: string,
  queryString?: string,
  page: number = 1,
  perPage: number = 20,
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await requestInstance.get(`/beneficiaries/activity/${actId}/?` + params);
  return response;
}