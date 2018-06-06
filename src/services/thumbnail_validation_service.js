import { VALID_THUMBNAIL_FILE_EXTENSIONS, MAX_THUMBNAIL_SIZE } from '../constants';
import { FileValidationService } from 'Services/file_validation_service';

class ThumbnailValidationService {
  static containsValidExtension(fileName) {
    return VALID_THUMBNAIL_FILE_EXTENSIONS.includes(FileValidationService.getExtension(fileName));
  }

  static isValidFileSize(fileSize) {
    return fileSize <= MAX_THUMBNAIL_SIZE;
  }

  static valid(file) {
    return (this.containsValidExtension(file.name) && this.isValidFileSize(file.size));
  }
}

export { ThumbnailValidationService };
