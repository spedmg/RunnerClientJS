const { FileFactory } = require('./file_factory');
const { MAX_UPLOAD_COUNT } = require('../constants');

class FileUploadService {
  static addFiles(currentFiles, fileList) {
    return new Promise((resolve, reject) => {
      // TODO: return Promise... resolve if all added, reject if too many
      fileList = this.removeDuplicates(currentFiles, fileList);

      if ((currentFiles.length + fileList.length) > MAX_UPLOAD_COUNT) {
        reject({
          error: `[RunnerClient] Too many files added. Uploads can have a maximum of ${MAX_UPLOAD_COUNT} files.`
        });
      }
      for (let i = 0, length = fileList.length; i < length; i++) {
        // if (currentFiles.length >= config.aspera.limit) {
        //   announcerService.fileUploadLengthInvalid({numCurrentFiles: currentFiles.length});
        //
        //   break;
        // }
        //
        let file = new FileFactory(fileList[i]);

        currentFiles.unshift(file);
      }

      // announcerService.fileUploadServiceFileAdded({currentFiles: currentFiles, fileWasAdded: fileList.length});
      //
      // if (currentStateService.includesUploadState()) {
      //   announcerService.
      //     fileUploadServiceAdvancedUploadFileAdded({currentFiles: currentFiles, fileWasAdded: fileList.length});
      // }
    });
  }

  static getFileAtIndex(files, index) {
    return files[index];
  }

  static getFileNameIndex(fileName, fileNames) {
    return fileNames.indexOf(fileName);
  }

  static getFullFilePaths(files) {
    return files.map(function (file) {
      return file.fullFilePath;
    });
  }

  static getFileNames(files) {
    return files.map(function (file) {
      return file.fileName;
    });
  }

  static getStatuses(files) {
    return files.map(function (file) {
      return file.status;
    });
  }

  static removeDuplicates(currentFiles, newFileList) {
    let existingFileNames = currentFiles.map((file) => file.fullFilePath);
    let uniqueFileList = [];

    newFileList.forEach(function (file) {
      if (existingFileNames.indexOf(file.name) === -1) {
        uniqueFileList.push(file);
      }
    });

    return uniqueFileList;
  }

  static removeFile(files, file) {
    let filePaths = this.getFullFilePaths(files),
      fileNameIndex = this.getFileNameIndex(file.fullFilePath, filePaths),
      fileToRemove = this.getFileAtIndex(files, fileNameIndex);

    if (!fileToRemove) {
      return;
    }

    files.splice(fileNameIndex, 1);

    announcerService.fileUploadServiceFileRemoved({currentFiles: files});

    if (currentStateService.includesUploadState()) {
      announcerService.fileUploadServiceAdvancedUploadFileRemoved({currentFiles: files});
    }
  }

  static someFilesValid(files) {
    return files.length && files.some((file) => file.valid());
  }

  static allFilesValid(files) {
    return files.length && files.length === this.validFileCount(files);
  }

  static validFileCount(files) {
    return files.filter((file) => file.valid()).length;
  }
}

module.exports = { FileUploadService };
