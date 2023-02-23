export class AsperaConnectService {
    static initialize(): void;
    static set eventCallbacks(arg: any);
    static get eventCallbacks(): any;
    static get connect(): any;
    static start(transferSpecs: any, connectionSettings: any): {
        id: number;
        promise: Promise<any[]>;
    };
    static showFileUploadDialog(successCallback: any): void;
    static showFolderUploadDialog(successCallback: any): void;
    static _handleAsperaEvent(eventName: any, eventData: any): void;
    static _executeEventListenersFor(eventName: any, eventData: any): void;
    static _handleAsperaStatusEvent(eventData: any): void;
    static _handleAsperaTransferEvent(eventData: any): void;
    static get hasActiveTransfers(): boolean;
    static _getTransferDataFor(transfer: any): {
        id: string;
        token: any;
        index: any;
    };
    static _removeTransferListener(): void;
    /**
     * Use this setter to provide non-default configuration to the
     * AW4.Connect() constructor
     */
    static set CONNECT_OPTIONS(arg: any);
    static get CONNECT_OPTIONS(): any;
    /**
     * Use this setter to provide non-default configuration to the
     * AW4.ConnectInstaller() constructor
     */
    static set CONNECT_INSTALLER_OPTIONS(arg: any);
    static get CONNECT_INSTALLER_OPTIONS(): any;
}
