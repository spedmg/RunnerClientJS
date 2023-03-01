export = RunnerClient;
declare class RunnerClient {
    static get version(): any;
    static configure(options: any): void;
    static loadComponents(): Promise<void>;
}
