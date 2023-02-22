export class AsperaUploadService {
    static get activeUploads(): {};
    static get hasActiveUploads(): boolean;
    static get asperaConnectService(): typeof AsperaConnectService;
    static upload(currentFiles: any, options: any): Promise<any>;
    /**
     * Callback executed on AW4 'transfer' event when AsperaConnectService
     * determines the transfer has completed.
     * @param {object}  data
     * @param {object}  data.transfer - transfer data from AW4.Connect
     * @param {number}  data.id - internal tracking ID for transfer batch. NOT the
     *                            runner ingest batch ID
     * @param {string}  data.token - aspera request_id
     * @param {boolean} data.isBatchComplete
     */
    static _onTransferComplete(data: {
        transfer: object;
        id: number;
        token: string;
        isBatchComplete: boolean;
    }): void;
}
import { AsperaConnectService } from "./aspera_connect_service";
