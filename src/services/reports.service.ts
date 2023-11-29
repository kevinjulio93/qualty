import { REPORT_TYPE } from "../constants/reportType";
import { FecthRequestModel } from "../models/request.model";

const requestInstance = FecthRequestModel.getInstance();

export async function getExcelEventAssistance(event_id: string) {
    try {
      const url = `/reports`;
      const requestBody = {
        configObject: { event_id },
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

export async function getExcelActivityAssistance(act_id: string) {
    try {
      const url = `/reports`;
      const requestBody = {
        configObject: { act_id },
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

export async function getExcelBeneficiaryList(type) {
    try {
      const url = `/reports`;
      const requestBody = {
        configObject: {},
        type,
      };
      const response = await requestInstance.getBlob(url, requestBody);
  
      const blob =  response.result;
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = "beneficiary_list__"+Date.now()+".xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
}

export async function getExcelEventActivityDiff(act_id: string, event_id: string) {
  try {
    const url = `/reports`;
    const requestBody = {
      configObject: { event_id, act_id },
      type: REPORT_TYPE.EVENT_ASSISTANCE_DIFF,
    };
    const response = await requestInstance.getBlob(url, requestBody);

    const blob =  response.result;
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = "event_activity__"+Date.now()+".xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error fetching PDF:", error);
  }
}