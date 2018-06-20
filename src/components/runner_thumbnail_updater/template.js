const { TranslationService } = require('../../services/translation_service');
const TRANSLATION_SCOPE = { scope: 'RunnerThumbnailUpdater' };
const t = (key) => {
  return TranslationService.translate(key, TRANSLATION_SCOPE);
};

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
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

    :host #preview {
      height: 100%;
      display: flex;
      justify-content: center;
      flex: 1;
    }

    :host #preview img {
      flex: 0;
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
    :host[uploading] #add-file-button {
      display: none;
    }

    :host[upload-complete] #upload-complete {
      display: flex;
    }
    :host[upload-complete] #upload-button,
    :host[upload-complete] #add-file-button {
      display: none;
    }

    :host #add-file-input {
      display: none;
    }

    :host footer {
      background: rgba(0, 0, 0, 0.1);
      width: 100%;
      padding: 8px;
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
      <h3>${t('emptyAdditionalText')}</h3>
    </slot>
  </div>

  <div id="incoming">
    <slot name="incoming">
      <h1>${t('incoming')}</h1>
    </slot>
  </div>

  <div id="preview"></div>

  <footer>
    <div id="error">
      <slot name="error">
        <span id="error-message">${t('error')}</span>
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
      </slot>
    </div>

    <slot name="addFileButton">
      <button type="button" id="add-file-button">${t('addFile')}</button>
      <input type="file" id="add-file-input" />
    </slot>

    <slot name="uploadButton">
      <button type="button" id="upload-button">${t('upload')}</button>
    </slot>
  </footer>
`;

module.exports = template;
