class FileValidationService {
  static getExtension(fileName) {
    return (fileName.toLowerCase().match(/^[^.].*(\.\w+)$/) || [])[1];
  }

  static getFileName(filePath) {
    return filePath.replace(/^[\w\W]*[/\\]/, '');
  }
}

export { FileValidationService };
