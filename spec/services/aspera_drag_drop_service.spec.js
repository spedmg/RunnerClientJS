import { AsperaDragDropService } from 'Services/aspera_drag_drop_service';
import { AsperaConnectService } from 'Services/aspera_connect_service';
import AW4 from 'asperaconnect';

describe('AsperaDragDropService', () => {
  let subject;
  let connectInstance;
  let defaultEventOpts = { bubble: true, cancelable: true, view: window };

  beforeEach(() => {
    connectInstance = new AW4.Connect({ dragDropEnabled: true });
    spyOnProperty(AsperaConnectService, 'connect').and.returnValue(connectInstance);

    subject = class extends AsperaDragDropService {};
  });

  describe('.addTarget()', () => {
    let target;
    let callbacks;

    beforeEach(() => {
      target = document.createElement('div');
      spyOn(target, 'addEventListener').and.callThrough();

      callbacks = {
        all: [jasmine.createSpy('all')],
        dragEnter: [jasmine.createSpy('dragEnter')],
        dragLeave: [jasmine.createSpy('dragLeave')],
        dragOver: [jasmine.createSpy('dragOver')],
        drop: [jasmine.createSpy('drop')],
      };

      subject.addTarget(target, callbacks);
    });

    it('adds event listeners to the given target', () => {
      expect(target.addEventListener).toHaveBeenCalledWith('dragenter', jasmine.any(Function));
      expect(target.addEventListener).toHaveBeenCalledWith('dragleave', jasmine.any(Function));
      expect(target.addEventListener).toHaveBeenCalledWith('dragover', jasmine.any(Function));
      expect(target.addEventListener).toHaveBeenCalledWith('drop', jasmine.any(Function));
    });

    context('on dragOver', () => {
      let event;

      beforeEach(() => {
        event = new Event('dragover', defaultEventOpts);
        target.dispatchEvent(event);
      });

      it('triggers event listeners', () => {
        expect(callbacks.all[0]).toHaveBeenCalledWith({ event: event });
        expect(callbacks.dragOver[0]).toHaveBeenCalledWith({ event: event });
      });
    });

    context('on dragLeave', () => {
      let event;

      beforeEach(() => {
        event = new Event('dragleave', defaultEventOpts);
        target.dispatchEvent(event);
      });

      it('triggers event listeners', () => {
        expect(callbacks.all[0]).toHaveBeenCalledWith({ event: event });
        expect(callbacks.dragLeave[0]).toHaveBeenCalledWith({ event: event });
      });
    });

    context('on dragEnter', () => {
      let event;

      beforeEach(() => {
        event = new Event('dragenter', defaultEventOpts);
        target.dispatchEvent(event);
      });

      it('triggers event listeners', () => {
        expect(callbacks.all[0]).toHaveBeenCalledWith({ event: event });
        expect(callbacks.dragEnter[0]).toHaveBeenCalledWith({ event: event });
      });
    });

    context('on drop', () => {
      let event;

      beforeEach(() => {
        let file = { name: 'jeanluc.picard' };
        let nestedFile = { name: 'will.riker', path: 'enterprise/will.riker' };
        let folder = {
          name: 'enterprise',
          path: '/',
          getFilesAndDirectories: () => Promise.resolve([nestedFile])
        };
        event = new Event('drop', defaultEventOpts);
        event.dataTransfer = {
          getFilesAndDirectories: () => {
            return Promise.resolve([file, folder]);
          }
        };
        target.dispatchEvent(event);
        spyOn(connectInstance, 'connectHttpRequest').and.callThrough();
      });

      it('triggers event listeners', () => {
        console.log(callbacks.drop[0].calls.first());
        // expect(callbacks.all[0]).toHaveBeenCalledWith({ event: event });
        // expect(callbacks.drop[0]).toHaveBeenCalledWith({ event: event });
      });
    });
  });

  describe('.reset()', () => {

  });
});
