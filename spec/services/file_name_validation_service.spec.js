import { FileNameValidationService } from 'Services/file_name_validation_service';

describe('FileNameValidationService', function () {
  describe('.valid', function () {
    describe('given a file name containing valid characters', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('hello_world-my-friend.txt');
      });

      specify(function () {
        expect(this.subject).toEqual(true);
      });

      describe('given accented characters', function () {
        beforeEach(function () {
          this.subject = FileNameValidationService.valid('good_dûàè.txt');
        });

        specify(function () {
          expect(this.subject).toEqual(true);
        });
      });
    });

    describe('given a file name with no extension', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('README');
      });

      specify(function () {
        expect(this.subject).toEqual(false);
      });

      describe('but an extension is not required', function () {
        beforeEach(function () {
          this.subject = FileNameValidationService.valid('README', true);
        });

        specify(function () {
          expect(this.subject).toEqual(true);
        });
      });
    });

    describe('given a file name containing invalid characters', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('bar.@4!&*txt');
      });

      specify(function () {
        expect(this.subject).toEqual(false);
      });
    });

    describe('given any files starting with a dot', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('.file');
      });

      specify(function () {
        expect(this.subject).toEqual(false);
      });
    });

    describe('given an invalid file extension', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('this.exe');
      });

      specify(function () {
        expect(this.subject).toEqual(false);
      });
    });

    describe('given an empty fileName', function () {
      beforeEach(function () {
        this.subject = FileNameValidationService.valid('');
      });

      specify(function () {
        expect(this.subject).toEqual(false);
      });
    });
  });
});
