const { UNSUPPORTED_FILE_EXTENSIONS } = require('../constants');
const { FileValidationService } = require('./file_validation_service');

class FileNameValidationService {
  static containsValidCharacters(fileName) {
    return !(/:|\/|"|;|'|\?|!|>|<|&|\||\*|@/.test(fileName));
  }

  static containsExtension(fileName) {
    return !!FileValidationService.getExtension(fileName);
  }

  static containsValidExtension(fileName) {
    return !UNSUPPORTED_FILE_EXTENSIONS.includes(FileValidationService.getExtension(fileName));
  }

  static valid(fileName, doesNotRequireExtension) {
    if (doesNotRequireExtension) {
      return this.containsValidCharacters(fileName);
    } else {
      return (this.containsValidCharacters(fileName) &&
      this.containsExtension(fileName) &&
      this.containsValidExtension(fileName));
    }
  }
}

module.exports = { FileNameValidationService };
