
export class FecthRequestModel {
    public static instance: FecthRequestModel;
    private url:string;
    
    constructor() {
        //this.url = import.meta.env.VITE_NODE_ENV === 'production'? import.meta.env.VITE_PROD_API_URL:import.meta.env.VITE_DEV_API_URL;
        this.url = "https://upedcucuta.com/api";
        //this.url = "http://localhost:3000";
    }


    public static getInstance() {
        if (!FecthRequestModel.instance){
            FecthRequestModel.instance = new FecthRequestModel();
        }
        return FecthRequestModel.instance;
    }
  
    private getOption(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean, haveFormData?:boolean) {
      const _body = haveFormData ? body : JSON.stringify(body);
      const options = {
        method,
        ...(this.getFetchOptions(isPublic, haveFormData))
        
      };
      return body ? {...options, body: _body } : options ;
    }
  
    private statusError = ({ status, statusText }:{status:number,statusText:string}) => ({ status, statusText });


    private getFetchOptions(isPublic?: boolean, haveFormData?:boolean): Record<string, unknown> {
     try {
        const loggedUserApp = JSON.parse(localStorage.getItem('user'));
        let resultOptions: Record<string, unknown> = { 'headers': { 'Content-Type': 'application/json' } };
        if (haveFormData) resultOptions = { 'headers': {} }
        if (!isPublic) {
          (resultOptions['headers'] as any)['x-access-token'] = `${loggedUserApp?.token}`
        }
        return resultOptions;
     } catch (error) {
       throw this.handleError(error);
     }
    }
  
    private async handleResponse(response: any) {
      if (!response.ok) {
        if (response.status === 400 || (response.status >= 400 && response.status < 500)) {
          throw await response.json();
        } else {
          throw this.statusError(response);
        }
      }
      return response.json();
    }

    private async handleResponseBlob(response: any) {
      if (!response.ok) {
        if (response.status === 400 || (response.status >= 400 && response.status < 500)) {
          throw await response.blob();
        } else {
          throw this.statusError(response);
        }
      }
      return response.blob();
    }

    private async callRequestBlob(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean, haveFormData?:boolean) {
      try {
        let options:any = { ...this.getOption(method, body, isPublic, haveFormData) };
        const getResponse = await fetch(url, { ...options });
        const result = await this.handleResponseBlob(getResponse);
        result.name=getResponse.headers.get("NameFile");
        return {result, status: getResponse.status};
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    private handleError(error: any) {
      throw { error: 'catch', message: error };
    }
  
    private async callRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean, haveFormData?:boolean) {
      try {
        let options:any = { ...this.getOption(method, body, isPublic, haveFormData) };
        const getResponse = await fetch(url, { ...options });
        const result = await this.handleResponse(getResponse);
        return {result, status: getResponse.status};
      } catch (error) {
        throw this.handleError(error);
      }
    }
  
    private getCompleteURL(path:string) {
      return `${this.url}${path}`
    }

    getBlob(path:string,body?:any){
      const url = this.getCompleteURL(path);
      return this.callRequestBlob(url, 'POST',body);
    }

    getBlobWithParams(path:string){
      const url = this.getCompleteURL(path);
      return this.callRequestBlob(url, 'GET');
    }

    
  
    get(path: string) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'GET');
    }
  
    post(path: string, body:any, isPublic?:boolean, haveFormData?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'POST', body ?? {}, isPublic, haveFormData);
    }
  
    put(path: string, body:any, isPublic?:boolean, haveFormData?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'PUT', body ?? {}, isPublic, haveFormData);
    }
  
    delete(path: string, body?:any, isPublic?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'DELETE', body ?? {}, isPublic);
    }
  }