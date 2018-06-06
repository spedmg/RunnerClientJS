import { ThumbnailValidationService } from 'Services/thumbnail_validation_service';
import { MAX_THUMBNAIL_SIZE } from '../../src/constants';

describe('sharedServices.ThumbnailValidationService', function () {
  let file;

  beforeEach(() => {
    file = {
      name: 'foo.jpg',
      size: MAX_THUMBNAIL_SIZE - 1
    };
  });

  describe('.valid', function () {
    describe('file name', function () {
      describe('given a file name containing a valid extension', function () {
        beforeEach(function () {
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(true);
        });
      });

      describe('given a file name starting with a dot', function () {
        beforeEach(function () {
          file.name = '.foo';
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(false);
        });
      });

      describe('given a file name with an invalid file extension', function () {
        beforeEach(function () {
          file.name = 'bar.baz';
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(false);
        });
      });

      describe('given an empty fileName', function () {
        beforeEach(function () {
          file.name = '';
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toEqual(false);
        });
      });
    });

    describe('file size', function () {
      describe('given a file size under thumbnail max', function () {
        beforeEach(function () {
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(true);
        });
      });

      describe('given a file size equal to thumbnail max', function () {
        beforeEach(function () {
          file.size = MAX_THUMBNAIL_SIZE;
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(true);
        });
      });

      describe('given a file size over thumbnail max', function () {
        beforeEach(function () {
          file.size = MAX_THUMBNAIL_SIZE + 1;
          this.subject = ThumbnailValidationService.valid(file);
        });

        specify(function () {
          expect(this.subject).toBe(false);
        });
      });
    });
  });
});
