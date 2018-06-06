import { FileFactory } from 'Services/file_factory';
import { FileNameValidationService } from 'Services/file_name_validation_service';
import { ThumbnailValidationService } from 'Services/thumbnail_validation_service';

describe('FileFactory', () => {
  let subject;
  let file;

  beforeEach(function () {
    spyOn(FileNameValidationService, 'valid');
    spyOn(FileNameValidationService, 'containsValidCharacters').and.returnValue(true);
    spyOn(FileNameValidationService, 'containsExtension').and.returnValue(true);
    spyOn(FileNameValidationService, 'containsValidExtension').and.returnValue(true);

    spyOn(ThumbnailValidationService, 'valid');
  });

  beforeEach(function () {
    file = { name: '/path/to/foo.mp4', doesNotRequireExtension: 'does-not-require-extension' };
    subject = new FileFactory(file);
  });

  describe('.processing', function () {
    describe('by default', function () {
      it('returns false', function () {
        expect(subject.processing).toEqual(false);
      });
    });
  });

  describe('.hasValidCharacters', function () {
    it('calls to fileNameValidationService', function () {
      expect(FileNameValidationService.containsValidCharacters).toHaveBeenCalledWith(subject.fileName);
      expect(subject.hasValidCharacters).toEqual(true);
    });
  });

  describe('.hasExtension', function () {
    it('calls to fileNameValidationService', function () {
      expect(FileNameValidationService.containsExtension).toHaveBeenCalledWith(subject.fileName);
      expect(subject.hasExtension).toEqual(true);
    });
  });

  describe('.hasValidExtension', function () {
    it('calls to fileNameValidationService', function () {
      expect(FileNameValidationService.containsValidExtension).toHaveBeenCalledWith(subject.fileName);
      expect(subject.hasValidExtension).toEqual(true);
    });
  });

  describe('.fullFilePath', function () {
    it('returns the full file path', function () {
      expect(subject.fullFilePath).toEqual('/path/to/foo.mp4');
    });
  });

  describe('.fileObj', function () {
    it('returns the original file obj', function () {
      expect(subject.fileObj).toEqual(file);
    });
  });

  describe('.valid', function () {
    it('calls through to FileNameValidationService', function () {
      subject.valid();
      expect(FileNameValidationService.valid).toHaveBeenCalledWith(subject.fileName, 'does-not-require-extension');
    });
  });

  describe('.validThumbnail', function () {
    beforeEach(function () {
      subject.validThumbnail();
    });

    it('calls through to FileNameValidationService', function () {
      expect(FileNameValidationService.valid).toHaveBeenCalledWith(subject.fileName, 'does-not-require-extension');
    });

    it('calls through to ThumbnailValidationService', function () {
      expect(ThumbnailValidationService.valid).toHaveBeenCalled();
    });
  });
});
