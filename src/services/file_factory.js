const { FileNameValidationService } = require('./file_name_validation_service');
const { FileValidationService } = require('./file_validation_service');
const { ThumbnailValidationService } = require('./thumbnail_validation_service');
const uuid = require('uuid/v4');

class FileFactory {
  constructor(file) {
    this.fileName = FileValidationService.getFileName(file.name);
    this.fullFilePath = file.name;
    this.processing = false;
    this.size = file.size;
    this.fileObj = file;
    this.uuid = uuid();

    this.hasValidCharacters = FileNameValidationService.containsValidCharacters(this.fileName);
    this.hasExtension = FileNameValidationService.containsExtension(this.fileName);
    this.hasValidExtension = FileNameValidationService.containsValidExtension(this.fileName);

    this.valid = function () {
      return FileNameValidationService.valid(this.fileName, this.fileObj.doesNotRequireExtension);
    };

    this.validThumbnail = function () {
      let validFile = this.valid();
      let validThumbnail = ThumbnailValidationService.valid(file);

      return validFile && validThumbnail;
    };
  }
}

module.exports = { FileFactory };
