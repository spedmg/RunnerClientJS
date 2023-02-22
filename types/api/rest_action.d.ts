export class RestAction {
    static get(endpoint: any, config: any): Promise<any>;
    static patch(endpoint: any, data: any): Promise<any>;
    static post(endpoint: any, data: any): Promise<any>;
    static http(): Promise<any>;
}
