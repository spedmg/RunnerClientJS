const FileUploadServiceInjector  = require('inject-loader!Services/file_upload_service');
const FileUploadService = FileUploadServiceInjector({
  '../constants': { MAX_UPLOAD_COUNT: 2 }
}).FileUploadService;

describe('FileUploadService', function () {
  let subject;

  beforeEach(function () {
    subject = FileUploadService;

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

        expect(actual.length).toEqual(expected.length);
        expected.forEach((ex, idx) => {
          expect(actual[idx].name).toEqual(expected.name);
        });
      });
    });
  });

  describe('.addFiles', function () {
    beforeEach(function () {
      this.setFileList();
    });

    describe('given files have been selected', function () {
      describe('given pre-existing files in the list', function () {
        beforeEach(async function() {
          this.setCurrentFiles();
          await subject.addFiles(this.currentFiles, this.fileList);
        });

        it('adds the new files to the beginning of the array', function () {
          let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

          expect(actual.length).toEqual(expected.length);
          expected.forEach((ex, idx) => {
            expect(actual[idx].name).toEqual(expected.name);
          });
        });

        describe('given duplicate files', function () {
          beforeEach(async function () {
            this.setCurrentFiles();
            await subject.addFiles(this.currentFiles, this.fileList);
          });

          it('does not add duplicate files to the array', function () {
            let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
            let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

            expect(actual.length).toEqual(expected.length);
            expected.forEach((ex, idx) => {
              expect(actual[idx].name).toEqual(expected.name);
            });
          });
        });
      });

      describe('given no pre-existing files in the list', function () {
        beforeEach(async function () {
          this.clearCurrentFiles();
          await subject.addFiles(this.currentFiles, this.fileList);
        });

        it('adds the specified files', function () {
          let expected  = ['path/to/bar.txt', 'path/to/foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fullFilePath; });

          expect(actual.length).toEqual(expected.length);
          expected.forEach((ex, idx) => {
            expect(actual[idx].name).toEqual(expected.name);
          });
        });
      });

      describe('given the total number of files is over our aspera limit', function() {
        beforeEach(function() {
          this.clearCurrentFiles();
          subject.addFiles(this.currentFiles, [{name: 'foo.txt'}, {name: 'bar.txt'}, {name: 'baz.txt'}]);
        });

        specify(function (done) {
          subject.addFiles(this.currentFiles, [{name: 'foo.txt'}, {name: 'bar.txt'}, {name: 'baz.txt'}]).catch((e) => {
            expect(e.error).toMatch(/too many files/i);
            done();
          });
        });
      });
    });

    describe('given files have not been selected', function () {
      beforeEach(function () {
        this.clearFileList();
      });

      describe('given pre-existing files in the list', function () {
        beforeEach(async function () {
          this.setCurrentFiles();
          await subject.addFiles(this.currentFiles, this.fileList);
        });

        it('does not change the list of current file names', function () {
          let expected  = ['foo.txt'];
          let actual    = this.currentFiles.map(function(file) { return file.fileName; });

          expect(actual.length).toEqual(expected.length);
          expected.forEach((ex, idx) => {
            expect(actual[idx].name).toEqual(expected.name);
          });
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
});
