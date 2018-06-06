import { FileValidationService } from 'Services/file_validation_service';

describe('FileValidationService', function () {
  describe('.getExtension', function () {
    describe('given a file name with an extension', function () {
      beforeEach(function () {
        this.subject = FileValidationService.getExtension('foo.bar');
      });

      specify(function () {
        expect(this.subject).toEqual('.bar');
      });
    });

    describe('given a file name with a period', function () {
      beforeEach(function () {
        this.subject = FileValidationService.getExtension('foo.bar.baz');
      });

      specify(function () {
        expect(this.subject).toEqual('.baz');
      });
    });

    describe('given a file name without an extension', function () {
      beforeEach(function () {
        this.subject = FileValidationService.getExtension('foo');
      });

      specify(function () {
        expect(this.subject).toBeUndefined();
      });
    });

    describe('given a file name starting with a dot', function () {
      beforeEach(function () {
        this.subject = FileValidationService.getExtension('.foo');
      });

      specify(function () {
        expect(this.subject).toBeUndefined();
      });
    });

    describe('given an empty file name', function () {
      beforeEach(function () {
        this.subject = FileValidationService.getExtension('');
      });

      specify(function () {
        expect(this.subject).toBeUndefined();
      });
    });
  });

  describe('.getFileName', function () {
    beforeEach(function () {
      this.path = 'path/to/foo.bar';
      this.subject = FileValidationService.getFileName(this.path);
    });

    specify(function () {
      expect(this.subject).toEqual('foo.bar');
    });
  });
});
