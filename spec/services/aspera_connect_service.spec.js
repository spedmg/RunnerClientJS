import { AsperaConnectService } from '../../src/services/aspera_connect_service';
const AW4 = window.AW4;

describe('AsperaConnectService', () => {
  let connectConstructorDouble;
  let connectInstanceDouble;
  let subject;
  let eventCallbacks;
  let triggerEventCallback;
  let originalConnect;

  afterEach(() => {
    AW4.Connect = originalConnect;
  });

  beforeEach(() => {
    originalConnect = AW4.Connect;
    eventCallbacks = {
      start: [],
      transfer: [],
      transferComplete: [],
      status: []
    };

    connectConstructorDouble = td.imitate(AW4.Connect);
    connectInstanceDouble = td.imitate(new AW4.Connect());
    td.when(
      connectConstructorDouble({
        id: td.matchers.isA(String),
        dragDropEnabled: true,
        minVersion: td.matchers.contains(/\d{1,2}\.\d{1,2}\.\d{1,2}/)
      })
    ).thenReturn(connectInstanceDouble);

    AW4.Connect = connectConstructorDouble;
    subject = class extends AsperaConnectService {};
    subject.eventCallbacks = eventCallbacks;
  });

  describe('initialize()', () => {
    it('sets up a new instance of AW4.Connect', () => {
      subject.initialize();
      expect().toVerify(connectInstanceDouble.addEventListener('status', td.matchers.isA(Function)));
    });
  });

  describe('start()', () => {
    let dummyTransferSpec1 = { request_id: 'quack' };
    let dummyTransferSpec2 = { request_id: 'rich' };
    let dummyConnectionSettings = {};

    beforeEach(() => {
      subject.connect.addEventListener = (eventName, callback) => {
        triggerEventCallback = (eventName, eventData) => { (callback.bind(subject))(eventName, eventData); };
      };

      td.when(
        subject.connect.startTransfer(dummyTransferSpec1, dummyConnectionSettings, td.matchers.isA(Object))
      ).thenReturn({ request_id: 'quackQuack' });
      td.when(
        subject.connect.startTransfer(dummyTransferSpec2, dummyConnectionSettings, td.matchers.isA(Object))
      ).thenReturn({ request_id: 'richyRich' });
    });

    it('calls startTransfer on the Aspera Web Connect client', () => {
      let result;
      subject.eventCallbacks.start = [
        (res) => {
          result = res;
        }
      ];
      subject.start([dummyTransferSpec1], dummyConnectionSettings);
      expect(result.request_id).toEqual('quackQuack');
    });

    describe('listeners', function () {
      let eventData;
      let transferCallback;
      let transferCompleteCallback;

      beforeEach(() => {
        transferCallback = jasmine.createSpy('transferCallback');
        transferCompleteCallback = jasmine.createSpy('transferCompleteCallback');

        eventCallbacks.transfer.push(transferCallback);
        eventCallbacks.transferComplete.push(transferCompleteCallback);

        subject.start([dummyTransferSpec1, dummyTransferSpec2], dummyConnectionSettings);
        eventData = {
          result_count: 123,
          transfers: [
            {
              aspera_connect_settings: { request_id: 'quackQuack' },
              transfer_spec: { paths: [ { source: '/mcduck', destination: '/mcduck123' } ], token: 'quack' },
              percentage: 0,
            },
            {
              aspera_connect_settings: { request_id: 'richyRich' },
              transfer_spec: { paths: [ { source: '/mcduck/luckydime.mov', destination: '/mcduck123/luckydime.mov' } ], token: 'rich' },
              percentage: 0,
            }
          ],
        };
      });

      describe('when a transfer has not already completed', function () {
        it('announces on progress', function () {
          triggerEventCallback('transfer', eventData);
          expect(transferCallback).toHaveBeenCalledWith(eventData.transfers[0]);
          expect(transferCallback).toHaveBeenCalledWith(eventData.transfers[1]);
        });

        // NOTE:
        // This spec is currently failing, since testdouble doesn't let us
        // invoke a callback within an an object (in this case, the function on
        // `success`). See
        // https://github.com/testdouble/testdouble.js/issues/230
        //
        // I'll look into doing a PR to that project to add this functionality.
        // [EP]
        it('announces when it is complete', function () {
          triggerEventCallback('transfer', eventData);
          expect(transferCompleteCallback).not.toHaveBeenCalled();

          eventData.transfers[0].percentage = 1;
          triggerEventCallback('transfer', eventData);

          eventData.transfers[1].percentage = 1;
          triggerEventCallback('transfer', eventData);

          // expect(transferCompleteCallback.calls.allArgs()).toEqual([
          //   [{ transfer: eventData.transfers[0], id: '1', token: 'quackQuack', isBatchComplete: false }],
          //   [{ transfer: eventData.transfers[1], id: '1', token: 'richyRich',  isBatchComplete: true }]
          // ]);
        });
      });

      describe('when a transfer has already completed (it has no transfer spec)', function () {
        beforeEach(function () {
          delete eventData.transfers[0].transfer_spec;
          delete eventData.transfers[1].transfer_spec;
          eventData.transfers[0].percentage = 1;
          eventData.transfers[1].percentage = 1;
        });

        it('is ignored', function () {
          triggerEventCallback('transfer', eventData);

          expect(transferCallback).not.toHaveBeenCalled();
          expect(transferCompleteCallback).not.toHaveBeenCalled();
        });
      });
    });
  });
});
