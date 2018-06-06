import cloneDeep from 'lodash/cloneDeep';

class AsperaTransferSpecFormatterService {
  static formatted(uploadResponseData, files) {
    let nonPackageTransferSpec = cloneDeep(uploadResponseData.transfer_spec);
    let packageIndex = 0;
    let fileIndex = 0;
    let collection = (nonPackageTransferSpec.paths.length) ? [nonPackageTransferSpec] : [];
    let packageMappings = cloneDeep(uploadResponseData.package_transfer_specs);

    files.forEach(function (file) {
      let target;

      if (file.fileObj.isFolder) {
        let packageTransferSpec = packageMappings[packageIndex].transfer_spec;
        collection.push(packageTransferSpec);
        target = packageTransferSpec.paths[0];
        packageIndex += 1;
      } else {
        target = nonPackageTransferSpec.paths[fileIndex];
        fileIndex += 1;
      }

      target.source = file.fullFilePath;
    });

    return { all: collection, packageMappings: packageMappings };
  }
}

export { AsperaTransferSpecFormatterService };
