import { FecthRequestModel } from "../models/request.model";

const representativeRequest = FecthRequestModel.getInstance();

export async function getPdfDeliveryRepresentant(idRepresentant,idEvent) {
  try {
    const url = `/representants/deliverys/pdf/${idRepresentant}/${idEvent}`;
    const response = await representativeRequest.getBlobWithParams(url);

    const blob =  response.result;
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "Acta_entrega_representante_"+Date.now()+"_.pdf";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}

export async function createRepresentative(representative: any) {
  const response = await representativeRequest.post(
    "/representants",
    representative
  );
  return response;
}

export async function updateRepresentative(representative: any) {
  const response = await representativeRequest.put(
    "/representants/" + representative._id,
    representative
  );
  return response;
}

export async function getRepresentativesList(
  queryString?: string,
  page: number = 1,
  perPage: number = 20
) {
  const params = `page=${page}&perPage=${perPage}${
    queryString ? `&queryString=${queryString}` : ""
  }`;
  const response = await representativeRequest.get("/representants/?" + params);
  return response;
}

export async function deleteRepresentative(id: string) {
  const response = await representativeRequest.delete("/representants/" + id);
  return response;
}
