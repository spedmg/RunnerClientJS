export class Config {
    static get baseURI(): "https://sonypicturesrunner.com" | "https://staging.sonypicturesrunner.com" | "https://integration.sonypicturesrunner.com" | "http://localhost:3000";
    static set environment(arg: any);
    static get environment(): any;
    static set locale(arg: any);
    static get locale(): any;
    static set logLevel(arg: any);
    static get logLevel(): any;
    static get logLevelInt(): 0 | 1 | 2 | 3;
    static authenticate(username: any, password: any): Promise<void>;
}
export { Config as default };
