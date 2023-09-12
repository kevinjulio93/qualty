const loggedUser = JSON.parse(localStorage.getItem('user'));

export class FecthRequestModel {
    public static instance: FecthRequestModel;
    private url:string;
    
    constructor() {
        this.url = 'http://localhost:3000'
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
  
    private statusError = ({ status, statusText }) => ({ status, statusText });


    private getFetchOptions(isPublic?: boolean, haveFormData?:boolean): Record<string, unknown> {
      let resultOptions: Record<string, unknown> = { 'headers': { 'Content-Type': 'application/json' } };
      if (haveFormData) resultOptions = { 'headers': {} }
      if (!isPublic) {
        (resultOptions['headers'] as any)['x-access-token'] = `${loggedUser.token}`
      }
      return resultOptions;
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
  
    private handleError(error: any) {
      throw { error: 'catch', message: error };
    }
  
    private async callRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean, haveFormData?:boolean) {
      try {
        let options = { ...this.getOption(method, body, isPublic, haveFormData) };
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