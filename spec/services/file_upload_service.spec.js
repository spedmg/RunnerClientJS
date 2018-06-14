import { FileUploadService } from 'Services/file_upload_service';

xdescribe('FileUploadService', function () {
  let subject;

  beforeEach(function () {
    subject = class extends FileUploadService {};

    this.clearCurrentFiles = function () {
      let ctx = this;

      ctx.currentFiles = [];
    };

    this.clearFileList = function () {
      let ctx = this;

      ctx.fileList = [];
    };

    this.setCurrentFiles = function () {
      let ctx = this;

      ctx.currentFiles = [{
        valid: function () {
          return true;
        },

        fileName: 'foo.txt',
        fullFilePath: 'path/to/foo.txt'
      }];
    };

    this.setFileList = function () {
      let ctx = this;

      ctx.fileList = [{
        name: 'path/to/foo.txt'
      }, {
        name: 'path/to/bar.txt'
      }];
    };
  });

  describe('.removeDuplicates', function () {
    describe('given duplicate files', function () {
      beforeEach(function () {
        this.setCurrentFiles();
        this.setFileList();
      });

      it('does not add duplicate files to the array', function () {
        let expected  = [{name: 'path/to/bar.txt'}];
        let actual    = subject.removeDuplicates(this.currentFiles, this.fileList);

        expect(actual).toEqual(expected);
      });
    });
  });

  describe('.addFiles', function () {
    beforeEach(function () {
      this.setFileList();
    });

    describe('given files have been selected', function () {
      describe('by default', function () {
        beforeEach(function () {
          spyOn(this.announcerService, 'fileUploadServiceFileAdded');

          this.clearCurrentFiles();
          subject.addFiles(this.currentFiles, this.fileList);
        });

        it('emits a file was added event', function () {
          expect(this.announcerService.fileUploadServiceFileAdded).toHaveBeenCalledWith({
            currentFiles: this.currentFiles,
            fileWasAdded: this.fileList.length
          });
        });
      });

      describe('given pre-existing files in the list', function () {
        beforeEach(function () {
          this.setCurrentFiles();
          subject.addFiles(this.currentFiles, this.fileList);
        });

        it('adds the new files to the beginning of the array', function () {
          let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

          expect(actual).toEqual(expected);
        });

        describe('given duplicate files', function () {
          beforeEach(function () {
            this.setCurrentFiles();
            subject.addFiles(this.currentFiles, this.fileList);
          });

          it('does not add duplicate files to the array', function () {
            let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
            let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

            expect(actual).toEqual(expected);
          });
        });
      });

      describe('given no pre-existing files in the list', function () {
        beforeEach(function () {
          this.clearCurrentFiles();
          subject.addFiles(this.currentFiles, this.fileList);
        });

        it('adds the specified files', function () {
          let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

          expect(actual).toEqual(expected);
        });
      });

      describe('given the total number of files is over our aspera limit', function() {
        beforeEach(function() {
          spyOn(this.announcerService, 'fileUploadLengthInvalid');

          this.clearCurrentFiles();
          subject.addFiles(this.currentFiles, [{name: 'foo.txt'}, {name: 'bar.txt'}, {name: 'baz.txt'}]);
        });

        it('emits a file upload length invalid event', function () {
          expect(this.announcerService.fileUploadLengthInvalid).toHaveBeenCalled();
        });

        it('emits the length of the currentFiles array', function () {
          expect(this.announcerService.fileUploadLengthInvalid)
            .toHaveBeenCalledWith({numCurrentFiles: this.currentFiles.length});
        });
      });
    });

    describe('given files have not been selected', function () {
      beforeEach(function () {
        this.clearFileList();
      });

      describe('given pre-existing files in the list', function () {
        beforeEach(function () {
          this.setCurrentFiles();
          subject.addFiles(this.currentFiles, this.fileList);
        });

        it('does not change the list of current file names', function () {
          let expected  = ['foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fileName; });

          expect(actual).toEqual(expected);
        });
      });

      describe('given no pre-existing files in the list', function () {
        beforeEach(function () {
          this.clearCurrentFiles();
          subject.addFiles(this.currentFiles, this.fileList);
        });

        it('adds the specified files', function () {
          let expected  = [];
          let actual    = this.currentFiles.map(function(file) { return file.fileName; });

          expect(actual).toEqual(expected);
        });
      });
    });
  });

  describe('.removeFile', function () {
    describe('given a file that exists', function () {
      beforeEach(function () {
        spyOn(this.announcerService, 'fileUploadServiceFileRemoved');

        this.currentFiles = [
          {
            fileName: 'file_a.txt',
            fullFilePath: 'path/to/file_a.txt',
            valid: function() { return true; },
          },
          {
            fileName: 'file_b.txt',
            fullFilePath: 'path/to/file_b.txt',
            valid: function() { return true; },
          }
        ];

        subject.removeFile(this.currentFiles, { fullFilePath: 'path/to/file_b.txt'});
      });

      it('removes file from the file list', function () {
        let expected  = ['path/to/file_a.txt'];
        let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

        expect(actual).toEqual(expected);
      });

      it('emits a file was removed event', function () {
        expect(this.announcerService.fileUploadServiceFileRemoved).toHaveBeenCalledWith({
          currentFiles: this.currentFiles
        });
      });
    });
  });

  describe('.validFileCount', function () {
    describe('given one valid file out of three', function () {
      beforeEach(function () {
        let good  = function () { return true;  };
        let bad   = function () { return false; };

        this.files = [
          { valid: good },
          { valid: bad  },
          { valid: bad  },
        ];
      });

      it('returns a count of one', function () {
        expect(subject.validFileCount(this.files)).toEqual(1);
      });
    });
  });
});
