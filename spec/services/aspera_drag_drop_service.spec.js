import { AsperaDragDropService } from 'Services/aspera_drag_drop_service';
import { AsperaConnectService } from 'Services/aspera_connect_service';
const AW4 = window.AW4;

describe('AsperaDragDropService', () => {
  let subject;
  let target;
  let callbacks;
  let connectInstance;
  let dragEnterResult = { event: { type: 'dragenter' } };
  let dragLeaveResult = { event: { type: 'dragleave' } };
  let dropResult = { event: { type: 'drop', timeStamp: 123 } };
  let addTarget;

  beforeEach(() => {
    connectInstance = new AW4.Connect({ dragDropEnabled: true });
    spyOnProperty(AsperaConnectService, 'connect').and.returnValue(connectInstance);
    spyOn(connectInstance, 'setDragDropTargets').and.callFake((selector, options, listener) => {
      listener(dragEnterResult);
      listener(dragLeaveResult);
      listener(dropResult);
    });

    subject = class extends AsperaDragDropService {};
    target = document.createElement('div');
    spyOn(target, 'addEventListener').and.callThrough();
    spyOn(target, 'removeEventListener').and.callThrough();

    callbacks = {
      dragenter: [jasmine.createSpy('dragEnter')],
      dragleave: [jasmine.createSpy('dragLeave')],
      drop: [jasmine.createSpy('drop')],
    };

    subject.promises['drop123'] = Promise.resolve();

    addTarget = () => {
      subject.addTarget(target, callbacks);
    }
  });

  describe('.addTarget()', () => {
    context('on dragOver', () => {
      it('triggers event listeners', () => {
        addTarget();
        expect(callbacks.dragenter[0]).toHaveBeenCalled();
      });
    });

    context('on dragLeave', () => {
      it('triggers event listeners', () => {
        addTarget();
        expect(callbacks.dragleave[0]).toHaveBeenCalled();
      });
    });

    context('on drop', () => {
      let testPromise;
      let event;

      beforeEach(() => {
        let file = { fullPath: '/stargazer/jeanluc.picard', isDirectory: false, isFile: true };
        let nestedFile = { fullPath: '/stargazer/enterprise/will.riker', isDirectory: false, isFile: true };

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

        dropResult.event.dataTransfer = {
				  items: [folder],
				  files: [folder],
				};
        testPromise = subject._groupedFolderContents(dropResult.event);
        subject.promises['drop123'] = testPromise;
        addTarget();
      });

      it('triggers event listeners', (done) => {
        let expected = jasmine.objectContaining ({
          event: dropResult.event,
          dragDropManifestGrouping: {
            'stargazer': [
              '/stargazer/jeanluc.picard',
              '/stargazer/enterprise/will.riker'
            ]
          }
        });
        testPromise.then(() => {
          expect(callbacks.drop[0]).toHaveBeenCalledWith(expected);
          done();
        });
      });
    });
  });

  describe('.reset()', () => {
    specify(() => {
      addTarget();
      subject._promises = undefined;
      subject.reset();
      expect(subject.promises).toEqual({});
      expect(target.removeEventListener).toHaveBeenCalledWith('drop', subject.dropListener);
    });
  });
});
