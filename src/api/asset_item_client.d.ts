export class AssetItemClient {
    static getAssetItem(id: any): Promise<any>;
    static bulkUpdate(assetItems: any, options: any): Promise<any>;
    static replaceThumbnail(assetId: any, replacementThumbnailName: any): Promise<any>;
}
