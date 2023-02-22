export class ThumbnailReplacementService {
    static replaceThumbnailFor(assetItemID: any, file: any): Promise<{
        id: any;
        thumbnail_url: any;
    }>;
    static _uploadImageToMCS(mcsId: any, token: any, file: any): any;
}
