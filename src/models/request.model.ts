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
  
    private getOption(method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean) {
      const options = {
        method,
        ...(this.getFetchOptions(isPublic))
        
      };
      return body ? {...options, body: JSON.stringify(body) } : options ;
    }
  
    private statusError = ({ status, statusText }) => ({ status, statusText });


    private getFetchOptions(isPublic?: boolean): Record<string, unknown> {
      const resultOptions: Record<string, unknown> = { 'headers': { 'Content-Type': 'application/json' } };
      if (!isPublic) {
        (resultOptions['headers'] as any)['x-access-token'] = `jwt ${loggedUser.token}`
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
  
    private async callRequest(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any, isPublic?:boolean) {
      try {
        let options = { ...this.getOption(method, body, isPublic) };
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
  
    post(path: string, body:any, isPublic?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'POST', body ?? {}, isPublic);
    }
  
    put(path: string, body:any, isPublic?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'PUT', body ?? {}, isPublic);
    }
  
    delete(path: string, body?:any, isPublic?:boolean) {
      const url = this.getCompleteURL(path);
      return this.callRequest(url, 'DELETE', body ?? {}, isPublic);
    }
  }