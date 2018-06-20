const { TranslationService } = require('../../services/translation_service');

const isEdge = window.AW4.Utils.BROWSER.EDGE;
const TRANSLATION_SCOPE = { scope: isEdge ? 'RunnerUploader.edge' : 'RunnerUploader' };

const t = (key) => {
  return TranslationService.translate(key, TRANSLATION_SCOPE);
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      border: 1px solid #999;
      height: 500px;
      width: 100%;
    }

    :host > * {
      box-sizing: border-box;
    }

    :host[incoming][empty] #incoming {
      display: flex;
    }

    :host[incoming][empty] #empty-dropzone {
      display: none;
    }

    :host[empty] #upload-button {
      display: none;
    }
    :host[empty] #empty-dropzone {
      display: flex;
    }

    :host #files-list {
      height: 100%;
      overflow-y: scroll;
    }

    :host #empty-dropzone {
      display: none;
      height: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    :host #incoming {
      align-items: center;
      display: none;
      height: 100%;
      justify-content: center;
      position: absolute;
      width: 100%;
      z-index: 10;
    }

    :host #error,
    :host #uploading,
    :host #upload-complete {
      display: none;
      flex: 1;
      justify-content: space-between;
    }

    :host[error] #error {
      display: flex;
    }

    :host[uploading] #uploading {
      display: flex;
    }
    :host[uploading] #upload-button,
    :host[uploading] #add-files-button {
      display: none;
    }

    :host[upload-complete] #upload-complete {
      display: flex;
    }
    :host[upload-complete] #upload-button,
    :host[upload-complete] #add-files-button {
      display: none;
    }

    :host footer {
      background: rgba(0, 0, 0, 0.1);
      position: absolute;
      width: 100%;
      padding: 8px;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
    }

    :host footer span {
      flex: 1;
    }
  </style>

  <div id="empty-dropzone">
    <slot name="emptyDropzone">
      <h1>${t('emptyHeadingText')}</h1>
      <h2>${t('emptySubheadingText')}</h2>
    </slot>
  </div>

  <div id="incoming">
    <slot name="incoming">
      <h1>${t('incoming')}</h1>
    </slot>
  </div>

  <div id="files-list"></div>

  <footer>
    <div id="error">
      <slot name="error">
        <span>${t('error')}</span>
      </slot>
    </div>

    <div id="uploading">
      <slot name="uploading">
        <span>${t('uploading')}</span>
      </slot>
    </div>

    <div id="upload-complete">
      <slot name="uploadComplete">
        <span>${t('uploadComplete')}</span>
        <button type="button" id="add-more-button">${t('uploadMore')}</button>
      </slot>
    </div>

    <slot name="addFilesButton">
      <button type="button" id="add-files-button">${t('addFiles')}</button>
    </slot>

    <slot name="uploadButton">
      <button type="button" id="upload-button">${t('upload')}</button>
    </slot>
  </footer>
`;

module.exports = template;
