import { UploadClient } from '../../src/api/upload_client';
import { RestAction } from '../../src/api/rest_action';

describe('UploadClient', () => {
  let postSpy;

  beforeEach(() => {
    postSpy = spyOn(RestAction, 'post').and.returnValue(Promise.resolve({ status: 201 }));
  });

  afterEach(() => {
  });

  describe('.post', () => {
    describe('with one file', () => {
      it('makes a post call for a new upload', async function () {
        let expectedData = {
          asset_items: [
            {
              folder_ids: ['foo', 'bar'],
              name: 'runner.mov'
            },
          ],
          exclude_asset_items: false
        };
        let promise = UploadClient.post([
          { name: 'runner.mov' }
        ], { folderIds: ['foo', 'bar'] });

        await promise.then(function (response) {
          let postArgs = postSpy.calls.argsFor(0);
          let url = postArgs[0];
          let data = postArgs[1];
          expect(url).toEqual('/api/v1/uploads');
          expect(data).toEqual(jasmine.objectContaining(expectedData));
          expect(response.status).toEqual(201);
        });
      });
    });

    describe('with multiple files', () => {
      describe('given no metadata', () => {
        it('makes a post call for a new upload', async function () {
          let expectedData = {
            asset_items: [
              {
                folder_ids: ['foo', 'bar'],
                name: 'runner.mov'
              },
              {
                folder_ids: ['foo', 'bar'],
                name: 'admin.txt'
              }
            ],
            exclude_asset_items: true,
          };

          let promise = UploadClient.post([
            { name: 'runner.mov'},
            { name: 'admin.txt'},
          ], { folderIds: ['foo', 'bar'], excludeAssetItems: true });

          await promise.then(function (response) {
            let postArgs = postSpy.calls.argsFor(0);
            let url = postArgs[0];
            let data = postArgs[1];
            expect(url).toEqual('/api/v1/uploads');
            expect(data).toEqual(jasmine.objectContaining(expectedData));
            expect(response.status).toEqual(201);
          });
        });
      });

      describe('given metadata', () => {
        describe('given no custom metadata', () => {
          it('makes a post call for a new upload', async function () {
            let metadata = {
              asset_type: 'Foo type'
            };

            let expectedData = {
              asset_items: [
                jasmine.objectContaining({
                  name: 'runner.mov',
                  folder_ids: ['foo', 'bar'],
                  asset_type_name: 'Foo type',
                }),
                jasmine.objectContaining({
                  name: 'admin.txt',
                  folder_ids: ['foo', 'bar'],
                  asset_type_name: 'Foo type',
                })
              ],
              exclude_asset_items: true,
            };

            let promise = UploadClient.post([
              { name: 'runner.mov' },
              { name: 'admin.txt' },
            ], { folderIds: ['foo', 'bar'], metadata: metadata, excludeAssetItems: true });

            await promise.then(function (response) {
              let postArgs = postSpy.calls.argsFor(0);
              let url = postArgs[0];
              let data = postArgs[1];
              expect(url).toEqual('/api/v1/uploads');
              expect(data).toEqual(expectedData);
              expect(response.status).toEqual(201);
            });
          });
        });

        describe('given some custom metadata', () => {
          it('makes a post call for a new upload', async () => {
            let metadata = {
              asset_type: 'Foo type',
              custom_metadata_fields: [ { category: 'fooCategory', label: 'barLabel', value: 'lolzy' } ]
            };

            let expectedData = {
              asset_items: [
                jasmine.objectContaining({
                  folder_ids: ['foo', 'bar'],
                  name: 'runner.mov',
                  asset_type_name: 'Foo type',
                  custom_metadata_fields: [
                    { category: 'fooCategory', label: 'barLabel', value: 'lolzy' }
                  ],
                }),
                jasmine.objectContaining({
                  folder_ids: ['foo', 'bar'],
                  name: 'admin.txt',
                  asset_type_name: 'Foo type',
                  custom_metadata_fields: [
                    { category: 'fooCategory', label: 'barLabel', value: 'lolzy' }
                  ],
                })
              ],
              exclude_asset_items: true,
            };

            let promise = UploadClient.post([
              { name: 'runner.mov' },
              { name: 'admin.txt' },
            ], { folderIds: ['foo', 'bar'], metadata: metadata, excludeAssetItems: true });

            await promise.then(function (response) {
              let postArgs = postSpy.calls.argsFor(0);
              let url = postArgs[0];
              let data = postArgs[1];
              expect(url).toEqual('/api/v1/uploads');
              expect(data).toEqual(expectedData);
              expect(response.status).toEqual(201);
            });
          });
        });

        describe('given titles', () => {
          it('makes a post call for a new upload', async () => {
            let metadata = {
              asset_type: 'Foo type',
              custom_metadata_fields: [],
              titles: [
                { id: 1, gpms_id: 55449, alpha: {alpha_id: 123456} },
                { id: 1, gpms_id: 99887 }
              ],
            };

            let expectedData = {
              asset_items: [
                jasmine.objectContaining({
                  folder_ids: ['foo', 'bar'],
                  name: 'runner.mov',
                  asset_type_name: 'Foo type',
                  custom_metadata_fields: [],
                  titles: [
                    {gpms_id: 55449, alpha_id: 123456},
                    {gpms_id: 99887},
                  ]
                }),
                jasmine.objectContaining({
                  folder_ids: ['foo', 'bar'],
                  name: 'admin.txt',
                  asset_type_name: 'Foo type',
                  custom_metadata_fields: [],
                  titles: [
                    {gpms_id: 55449, alpha_id: 123456},
                    {gpms_id: 99887},
                  ]
                })
              ],
              exclude_asset_items: true,
            };

            let promise = UploadClient.post([
              { name: 'runner.mov' },
              { name: 'admin.txt' },
            ], { folderIds: ['foo', 'bar'], metadata: metadata, excludeAssetItems: true });

            await promise.then(function (response) {
              let postArgs = postSpy.calls.argsFor(0);
              let url = postArgs[0];
              let data = postArgs[1];
              expect(url).toEqual('/api/v1/uploads');
              expect(data).toEqual(expectedData);
              expect(response.status).toEqual(201);
            });
          });
        });
      });
    });

    describe('file request upload', () => {
      it('makes a post call for a new upload', async () => {
        let expectedData = {
          asset_items: [
            { name: 'runner.mov' },
            { name: 'admin.txt' }
          ],
          exclude_asset_items: true,
          notes: 'I love uploading to runner',
          uuid: 'some-random-uuid'
        };

        let promise = UploadClient.post([
          { name: 'runner.mov' },
          { name: 'admin.txt' },
        ], {
          excludeAssetItems: true,
          uuid: 'some-random-uuid',
          notes: 'I love uploading to runner'
        });

        await promise.then(function (response) {
          let postArgs = postSpy.calls.argsFor(0);
          let url = postArgs[0];
          let data = postArgs[1];
          expect(url).toEqual('/api/v1/uploads');
          expect(data).toEqual(expectedData);
          expect(response.status).toEqual(201);
        });
      });
    });

    describe('when given http option', () => {
      it('makes a post call for a new upload', async () => {
        let expectedData = {
          asset_items: [
            {
              folder_ids: ['foo', 'bar'],
              name: 'runner.mov'
            },
          ]
        };

        let promise = UploadClient.post([
          { name: 'runner.mov' }
        ], { folderIds: ['foo', 'bar'], http: true });

        await promise.then(function (response) {
          let postArgs = postSpy.calls.argsFor(0);
          let url = postArgs[0];
          let data = postArgs[1];
          expect(url).toEqual('/api/v2/uploads/http');
          expect(data).toEqual(expectedData);
          expect(response.status).toEqual(201);
        });
      });
    });
  });
});
