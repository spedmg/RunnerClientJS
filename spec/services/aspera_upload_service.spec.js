import { AsperaUploadService } from 'Services/aspera_upload_service';
import { FileFactory } from 'Services/file_factory';
import { RestAction } from 'API/rest_action';
import { IngestBatchClient } from 'API/ingest_batch_client';
import { AssetItemClient } from 'API/asset_item_client';
import { AsperaConnectService } from 'Services/aspera_connect_service';

describe('AsperaUploadService', () => {
  let subject;
  let asperaServiceGroupId;
  let file;
  let transfer;
  let uploadResponse;
  let eventCallbackSpy;

  beforeEach(() => {
    file = new FileFactory({name: '/foo/bar/.txt'});
    asperaServiceGroupId = 1;

    spyOn(AsperaConnectService, 'start').and.returnValue(
      { id: asperaServiceGroupId, promise: { then: function () {} } }
    );

    eventCallbackSpy = spyOnProperty(AsperaConnectService, 'eventCallbacks', 'set');

    uploadResponse = {
      status: 201,
      data: {
        transfer_spec: {
          paths: []
        },
        package_transfer_specs: [
          {
            asset_item_id: 555,
            transfer_spec: {
              paths: [
                {
                  source: '/scrooge/ducktales folder',
                  destination: 'ducktales folder',
                }
              ],
            },
          },
        ],
        asset_items: [
          { name: 'ducktales folder' },
        ],
        ingest_batch_id: 123,
      }
    };

    transfer = {
      files: [
        { file: '/scrooge/ducktales folder/lucky-dime.mov' },
      ],
      transfer_spec: {
        paths: [
          { source: '/scrooge/ducktales folder' },
        ],
      },
    };
    spyOn(RestAction, 'post').and.returnValue(Promise.resolve(uploadResponse));
    spyOn(IngestBatchClient, 'completeUpload').and.returnValue(Promise.resolve({ status: 204 }));
    spyOn(AssetItemClient, 'bulkUpdate').and.returnValue(Promise.resolve({ status: 204 }));

    subject = class extends AsperaUploadService {};
  });

  describe('.upload', function () {
    describe('without using drag-drop', function () {
      beforeEach(async () => {
        file.fileObj.isFolder = true;
        file.fileObj.doesNotRequireExtension = true;
        file.fileName = 'ducktales folder';
        file.fullFilePath = '/scrooge/ducktales folder';

        await subject.upload([ file ], { folderIds: [ 1 ] });

        expect(eventCallbackSpy).toHaveBeenCalledWith({
          transferComplete: [jasmine.any(Function)]
        });

        expect(RestAction.post).toHaveBeenCalledWith('/api/v1/uploads', {
          asset_items: [{
            folder_ids: [1],
            name: 'ducktales folder',
            package: true,
          }],
          exclude_asset_items: false,
        });
      });

      specify(function () {
        // it doesn't do a bulk update if the batch isn't complete
        subject._onTransferComplete({ transfer: transfer, id: asperaServiceGroupId, isBatchComplete: false, });
        expect(AssetItemClient.bulkUpdate).not.toHaveBeenCalled();

        // when the batch is complete, it updates the ingest batch and sets the
        // manifest on packages
        subject._onTransferComplete({ transfer: transfer, id: asperaServiceGroupId, isBatchComplete: true, });
        expect(IngestBatchClient.completeUpload).toHaveBeenCalledWith(123);
        expect(AssetItemClient.bulkUpdate).toHaveBeenCalledWith([{
          id: 555,
          custom_metadata_fields: [
            {
              'category': 'tech_info',
              'label': 'manifest',
              'value': {
                'name': 'ducktales folder',
                'children': [
                  {
                    'name': 'lucky-dime.mov',
                  }
                ],
                'count': 1,
              }
            }],
        }], undefined);

        // it does not make additional calls if the batch has already been
        // completed.
        subject._onTransferComplete({ transfer: transfer, id: asperaServiceGroupId, isBatchComplete: true, });
        expect(AssetItemClient.bulkUpdate).toHaveBeenCalledTimes(1);
        expect(IngestBatchClient.completeUpload).toHaveBeenCalledTimes(1);
      });
    });

    describe('using drag-drop', function () {
      beforeEach(async () => {
        file.fileObj.isFolder = true;
        file.fileObj.doesNotRequireExtension = true;
        file.fileObj.fetchFolderContentsFromDragDropEvent = function () {
          return [ '/scrooge/ducktales folder/lucky-dime.mov' ];
        };
        file.fileName = 'ducktales folder';
        file.fullFilePath = '/scrooge/ducktales folder';

        await subject.upload([ file ], { folderIds: [ 1 ] });

        expect(RestAction.post).toHaveBeenCalledWith('/api/v1/uploads', {
          asset_items: [{
            name: 'ducktales folder',
            package: true,
            custom_metadata_fields: [
              {
                category: 'tech_info',
                label: 'manifest',
                value: {
                  'name': 'ducktales folder',
                  'children': [
                    {
                      'name': 'lucky-dime.mov',
                    }
                  ],
                  'count': 1,
                },
              }
            ],
            folder_ids: [1],
          }],
          exclude_asset_items: false,
        });
      });

      specify(function () {
        subject._onTransferComplete({ transfer: transfer, id: asperaServiceGroupId, isBatchComplete: false, });
        subject._onTransferComplete({ transfer: transfer, id: asperaServiceGroupId, isBatchComplete: true, });

        // it completes upload for the ingest batch
        expect(IngestBatchClient.completeUpload).toHaveBeenCalledWith(123);
        expect(IngestBatchClient.completeUpload).toHaveBeenCalledTimes(1);

        // it does not update the asset with a manifest
        expect(AssetItemClient.bulkUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
