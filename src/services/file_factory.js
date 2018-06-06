import { FileNameValidationService } from 'Services/file_name_validation_service';
import { FileValidationService } from 'Services/file_validation_service';
import { ThumbnailValidationService } from 'Services/thumbnail_validation_service';

class FileFactory {
  constructor(file) {
    this.fileName = FileValidationService.getFileName(file.name);
    this.fullFilePath = file.name;
    this.processing = false;
    this.size = file.size;
    this.fileObj = file;

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

export { FileFactory };
