const { TranslationService } = require('../../services/translation_service');

const isEdge = window.AW4.Utils.BROWSER.EDGE;
const TRANSLATION_SCOPE = { scope: isEdge ? 'SPEFileDrop.edge' : 'SPEFileDrop' };

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

    :host[empty] #empty-dropzone {
      display: flex;
    }

    #empty-dropzone {
      display: none;
      height: 100%;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    #incoming {
      align-items: center;
      display: none;
      height: 100%;
      justify-content: center;
      position: absolute;
      width: 100%;
      z-index: 10;
    }

    footer {
      background: rgba(0, 0, 0, 0.1);
      position: absolute;
      width: 100%;
      padding: 8px;
      bottom: 0;
      display: flex;
      justify-content: flex-end;
    }
  </style>

  <div id="empty-dropzone">
    <spe-file-drop--icon icon="upload" big></spe-file-drop--icon>
    <h1>${t('emptyHeadingText')}</h1>
    <h2>${t('emptySubheadingText')}</h2>
  </div>
  <div id="incoming">
    <h1>${t('incoming')}</h1>
  </div>

  <ul id="files-list"></ul>

  <footer>
    <button type="button" id="upload-button">${t('upload')}</button>
  </footer>
`;

module.exports = template;
