const { FileFactory } = require('./file_factory');
const { MAX_UPLOAD_COUNT } = require('../constants');

class FileUploadService {
  static addFiles(currentFiles, fileList) {
    return new Promise((resolve, reject) => {
      fileList = this.removeDuplicates(currentFiles, fileList);

      if ((currentFiles.length + fileList.length) > MAX_UPLOAD_COUNT) {
        reject({
          error: `[RunnerClient] Too many files added. Uploads can have a maximum of ${MAX_UPLOAD_COUNT} files.`
        });
      } else {
        currentFiles.push(...fileList);
        resolve({ files: currentFiles, filesAdded: fileList.length });
      }
    });
  }

  static removeDuplicates(currentFiles, newFileList) {
    let existingFileNames = currentFiles.map((file) => file.fullFilePath);
    let uniqueFileList = [];

    newFileList.forEach(function (file) {
      if (!existingFileNames.includes(file.name)) {
        let ffile = new FileFactory(file);
        uniqueFileList.push(ffile);
      }
    });

    return uniqueFileList;
  }

  static removeFileByUUID(files, uuid) {
    return new Promise((resolve, reject) => {
      let fileIdx = files.findIndex(file => { file.uuid === uuid; });
      if (fileIdx) {
        resolve(files.splice(fileIdx, 1));
      } else {
        reject();
      }
    });
  }
}

module.exports = { FileUploadService };
