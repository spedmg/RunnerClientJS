export class FileUploadService {
    static addFiles(currentFiles: any, fileList: any): Promise<any>;
    static removeDuplicates(currentFiles: any, newFileList: any): any[];
    static removeFileByUUID(files: any, uuid: any): Promise<any>;
}
