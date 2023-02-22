export class FileFactory {
    constructor(file: any);
    fileName: any;
    fullFilePath: any;
    processing: boolean;
    size: any;
    fileObj: any;
    uuid: any;
    hasValidCharacters: boolean;
    hasExtension: boolean;
    hasValidExtension: boolean;
    valid: () => boolean;
    validThumbnail: () => boolean;
}
