import { REPORT_TYPE } from "../constants/reportType";
import { FecthRequestModel } from "../models/request.model";

const requestInstance = FecthRequestModel.getInstance();

export async function getExcelEventAssistance(idEvent: string) {
    try {
      const url = `/reports`;
      const requestBody = {
        objectId: idEvent,
        type: REPORT_TYPE.EVENT_ASSISTANCE,
      };
      const response = await requestInstance.getBlob(url, requestBody);
  
      const blob =  response.result;
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "event_assistance__"+Date.now()+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
}

export async function getExcelActivityAssistance(actId: string) {
    try {
      const url = `/reports`;
      const requestBody = {
        objectId: actId,
        type: REPORT_TYPE.ACTIVITY_ASSISTANCE,
      };
      const response = await requestInstance.getBlob(url, requestBody);
  
      const blob =  response.result;
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "activity_assistance__"+Date.now()+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
}