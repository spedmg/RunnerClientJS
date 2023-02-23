export class MultipartUploadClient {
    static _buildURL(assetID: any, endpoint: any): string;
    static initiateAsset(assetId: any, partSize: any, uuid: any): Promise<any>;
    static retrieveUploadUrls(assetId: any, partNumbers: any, uuid: any): Promise<any>;
    static completeParts(assetId: any, parts: any, uuid: any): Promise<any>;
    static completeAsset(assetId: any, uuid: any): Promise<any>;
    static uploadFilepart(url: any, filepart: any): any;
}
