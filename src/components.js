import { SPEFileDrop } from 'Components/spe_file_drop';

export default class Components {
  static register() {
    Promise.resolve(SPEFileDrop.register(window));
  }
}
