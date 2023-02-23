export class PackageManifestService {
    static manifestForAsperaTransferEventData(asperaTransferEventData: any, packageTransferSpecs: any): {
        id: any;
        custom_metadata_fields: {
            category: string;
            label: string;
            value: {
                name: any;
                children: any[];
                count: number;
            };
        }[];
    };
    static manifestForFiles(files: any, path: any): {
        category: string;
        label: string;
        value: {
            name: any;
            children: any[];
            count: number;
        };
    }[];
    static present(manifest: any): {
        numberOfFiles: number;
        numberOfFolders: number;
        sorted: any[];
    };
    static _folderNameFromFullFolderPath(fullFolderPath: any): any;
    static _hasNonFolderChild(level: any): any;
    static _isValid(component: any): boolean;
    static _removeEmptyChildren(level: any): void;
    static _sort(collection: any): any[];
}
