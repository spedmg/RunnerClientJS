export class Authentication {
    static authenticate(baseURL: any, username: any, password: any): Promise<void>;
    static set token(arg: any);
    static get token(): any;
    static refreshToken(): Promise<void>;
    static set method(arg: any);
    static get method(): any;
    static currentToken(): Promise<any>;
    static httpHeaders(): Promise<{
        Authorization: string;
    }>;
    static get tokenExpired(): boolean;
}
