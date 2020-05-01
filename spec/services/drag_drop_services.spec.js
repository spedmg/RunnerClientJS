import { DragDropService } from 'Services/drag_drop_service';

describe('DragDropService', () => {
  let subject;
  let target;
  let callbacks;
  let defaultEventOpts = { bubble: true, cancelable: true, view: window };

  beforeEach(() => {
    subject = class extends DragDropService {};
    target = document.createElement('div');
    spyOn(target, 'addEventListener').and.callThrough();
    spyOn(target, 'removeEventListener').and.callThrough();

    callbacks = {
      all: [jasmine.createSpy('all')],
      dragEnter: [jasmine.createSpy('dragEnter')],
      dragLeave: [jasmine.createSpy('dragLeave')],
      dragOver: [jasmine.createSpy('dragOver')],
      drop: [jasmine.createSpy('drop')],
    };

    subject.addTarget(target, callbacks);
  });

  describe('.addTarget()', () => {
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
      let testPromise;
      let file;
      let nestedFile;

      beforeEach(() => {
        testPromise = new Promise((resolve) => {
          callbacks.drop.push(() => { resolve(); });
        });
        file = new File(['make it so'], 'jeanluc.picard', { type: 'text/plain' });
        nestedFile = new File(['engage'], 'will.riker', { type: 'text/plain' });
        let folder = {
          webkitGetAsEntry: () => { return folder; },
          name: 'stargazer',
          fullPath: '/stargazer',
          isDirectory: true,
          read: true,
          createReader: () => {
            return {
              readEntries: (cb) => {
                if (folder.read) {
                  folder.read = false;
                  cb([file, nestedFolder]);
                } else {
                  cb([]);
                }
              }
            };
          }
        };

        let nestedFolder = {
          webkitGetAsEntry: () => { return nestedFolder; },
          name: 'enterprise',
          fullPath: '/stargazer/enterprise',
          isDirectory: true,
          read: true,
          createReader: () => {
            return {
              readEntries: (cb) => {
                if (nestedFolder.read) {
                  nestedFolder.read = false;
                  cb([nestedFile]);
                } else {
                  cb([]);
                }
              }
            };
          }
        };

        event = new Event('drop', defaultEventOpts);
        event.dataTransfer = {
          items: [folder],
          files: [folder],
        };
        target.dispatchEvent(event);
      });

      it('triggers event listeners', (done) => {
        let expected = jasmine.objectContaining ({
          event: event,
          manifest: {
            'stargazer': {
              '/stargazer/jeanluc.picard': file,
              '/stargazer/enterprise/will.riker': nestedFile,
            }
          }
        });
        testPromise.then(() => {
          expect(callbacks.all[0]).toHaveBeenCalledWith(expected);
          expect(callbacks.drop[0]).toHaveBeenCalledWith(expected);
          done();
        });
      });
    });
  });

  describe('.reset()', () => {
    specify(() => {
      expect(subject.target).toBeDefined();
      subject.reset();
      expect(subject.target).toBeUndefined();
      expect(target.removeEventListener).toHaveBeenCalledWith('dragenter', subject._dragEnterCallback);
      expect(target.removeEventListener).toHaveBeenCalledWith('dragleave', subject._dragLeaveCallback);
      expect(target.removeEventListener).toHaveBeenCalledWith('dragover', subject._dragOverCallback);
      expect(target.removeEventListener).toHaveBeenCalledWith('drop', subject._dropCallback);
      expect(subject.eventCallbacks).toEqual({
        all: [],
        dragEnter: [],
        dragLeave: [],
        dragOver: [],
        drop: []
      });
    });
  });
});
