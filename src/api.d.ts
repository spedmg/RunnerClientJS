export class API {
    static getAssetItem(...args: any[]): Promise<any>;
    static upload(objects: any, options: any): Promise<any>;
    static completeIngestBatchUpload(ingestBatchId: any): Promise<any>;
    static bulkUpdateAssetItems(assetItems: any, options: any): Promise<any>;
    static replaceThumbnail(assetId: any, replacementThumbnailName: any): Promise<any>;
    static get Multipart(): typeof MultipartUploadClient;
}
import { MultipartUploadClient } from "./api/multipart_upload_client";
export { API as default };
