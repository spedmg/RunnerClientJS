import { AsperaConnectService } from '../../src/services/aspera_connect_service';
const AW4 = window.AW4;

describe('AsperaConnectService', () => {
  let connectConstructorDouble;
  let connectInstanceDouble;
  let subject;
  let eventCallbacks;
  let triggerEventCallback;
  let orginalConnect;

  afterEach(() => {
    AW4.Connect = orginalConnect;
  });

  beforeEach(() => {
    orginalConnect = AW4.Connect;
    eventCallbacks = {
      transfer: [],
      transferComplete: [],
      status: []
    };

    connectConstructorDouble = td.imitate(AW4.Connect);
    connectInstanceDouble = td.imitate(new AW4.Connect());
    td.when(
      connectConstructorDouble({
        id: td.matchers.contains(/RunnerClient\d+/),
        dragDropEnabled: true,
        minVersion: td.matchers.contains(/\d\.\d\.\d/)
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
    });

    it('calls startTransfer on the Aspera Web Connect client', () => {
      subject.start([dummyTransferSpec1], dummyConnectionSettings);

      expect().toVerify(
        subject.connect.startTransfer(dummyTransferSpec1, dummyConnectionSettings, td.matchers.isA(Object))
      );
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

        td.when(
          subject.connect.startTransfer(dummyTransferSpec1, dummyConnectionSettings, td.matchers.isA(Object))
        ).thenReturn({ request_id: 'quackQuack' });
        td.when(
          subject.connect.startTransfer(dummyTransferSpec2, dummyConnectionSettings, td.matchers.isA(Object))
        ).thenReturn({ request_id: 'richyRich' });

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

        it('announces when it is complete', function () {
          triggerEventCallback('transfer', eventData);
          expect(transferCompleteCallback).not.toHaveBeenCalled();

          eventData.transfers[0].percentage = 1;
          triggerEventCallback('transfer', eventData);

          eventData.transfers[1].percentage = 1;
          triggerEventCallback('transfer', eventData);

          expect(transferCompleteCallback.calls.allArgs()).toEqual([
            [{ transfer: eventData.transfers[0], id: '1', token: 'quackQuack', isBatchComplete: false }],
            [{ transfer: eventData.transfers[1], id: '1', token: 'richyRich',  isBatchComplete: true }]
          ]);
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
