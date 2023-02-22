export class IngestBatchClient {
    static completeUpload(ingestBatchId: any): Promise<any>;
    static getCounts(userId: any): Promise<any>;
    static getActivity(status: any, params: any): Promise<any>;
    static getIngestsFor(ingestBatchId: any): Promise<any>;
    static getAssetMetadataFor(ingestBatchId: any): Promise<any>;
}
