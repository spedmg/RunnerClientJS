import { RunnerUploader } from 'Components/runner_uploader/component';
import { AsperaDragDropService } from 'Services/aspera_drag_drop_service';

describe('<runner-uploader>', () => {
  let subject;
  let testContainer;
  let destinationFolder = '42';

  beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);

    spyOn(AsperaDragDropService, 'addTarget');
    spyOn(AsperaDragDropService, 'reset');

    testContainer.innerHTML = `
      <${RunnerUploader.elName} destination-folder="${destinationFolder}">
      </${RunnerUploader.elName}>
    `;

    subject = testContainer.querySelector(RunnerUploader.elName);
  });

  afterEach(() => {
    testContainer.remove();
  });

  describe('on element upgrade', () => {
    it('registers the drag-drop event listeners / callbacks', () => {
      expect(AsperaDragDropService.addTarget).toHaveBeenCalledWith(
        subject,
        jasmine.objectContaining({
          dragenter: [jasmine.any(Function)],
          dragleave: [jasmine.any(Function)],
          drop: [jasmine.any(Function)],
        })
      );
    });

    it('has expected properties', () => {
      expect(subject.destinationFolder).toEqual(destinationFolder);
      expect(subject.folderIDs).toEqual([destinationFolder]);
      expect(subject.files).toEqual([]);
      expect(subject.empty).toBe(true);
      expect(subject.error).toBe(false);
      expect(subject.incoming).toBe(false);
      expect(subject.uploading).toBe(false);
      expect(subject.uploadComplete).toBe(false);
    });
  });

  xdescribe('"Upload" button', () => {

  });

  xdescribe('"Add Files" button', () => {

  });

  describe('on dragEnter', () => {
    specify(() => {
      let dragEnterCallback = AsperaDragDropService.addTarget.calls.first().args[1].dragenter[0];

      dragEnterCallback();
      expect(subject.incoming).toEqual(true);
    });
  });

  describe('on dragLeave', () => {
    specify(() => {
      subject.incoming = true;
      let dragLeaveCallback = AsperaDragDropService.addTarget.calls.first().args[1].dragleave[0];

      dragLeaveCallback();
      expect(subject.incoming).toEqual(false);
    });
  });


  xdescribe('on drop', () => {

  });
});
