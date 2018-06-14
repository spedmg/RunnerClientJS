import { AsperaFileSerializer } from 'Services/aspera_file_serializer';

describe('AsperaFileSerializer', function () {
  beforeEach(function () {
    this.files = [
      {
        foo: 'bar',
        name: 'baz',
        size: 123,
        type: 'image/jpeg',
      },
      {
        qux: 'quux',
        name: 'corge',
        size: 345,
        type: 'inode/directory',
      }
    ];

    this.serialized = [
      {
        name: 'baz',
        size: 123,
        isFolder: false,
        doesNotRequireExtension: true,
      },
      {
        name: 'corge',
        size: 345,
        isFolder: true,
        doesNotRequireExtension: true,
      }
    ];
  });

  describe('result', function () {
    describe('given a result with files as the top level key', function () {
      beforeEach(function () {
        this.subject = AsperaFileSerializer.serialize({
          files: {
            dataTransfer: {
              files: this.files
            }
          }
        });
      });

      specify(function () {
        expect(this.subject).toEqual(this.serialized);
      });
    });

    describe('given a result with dataTransfer as the top level key', function () {
      beforeEach(function () {
        this.subject = AsperaFileSerializer.serialize({
          dataTransfer: {
            files: this.files
          }
        });
      });

      specify(function () {
        expect(this.subject).toEqual(this.serialized);
      });
    });

    describe('given a result from a drag and drop', function () {
      beforeEach(function () {
        this.subject = AsperaFileSerializer.serialize({
          dragDropManifestGrouping: {
            'corge': [
              '/some/file/path.mov',
            ]
          },
          files: {
            dataTransfer: {
              files: this.files
            }
          }
        });
      });

      it('attaches a manifest getter on folders only', function () {
        expect(this.subject[0].fetchFolderContentsFromDragDropEvent).toBeUndefined();
        expect(this.subject[1].fetchFolderContentsFromDragDropEvent()).toEqual(['/some/file/path.mov']);
      });
    });
  });
});
