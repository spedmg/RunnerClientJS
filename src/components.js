import { SPEFileDrop } from 'Components/spe_file_drop';
import WebComponents from 'webcomponents';

export default class Components {
  static register() {
    WebComponents.waitFor(() => {
      SPEFileDrop.register(window);
      return Promise.resolve();
    });
  }
}
