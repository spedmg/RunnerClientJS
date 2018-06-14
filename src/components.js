const { SPEFileDrop } = require('./components/spe_file_drop');

class Components {
  static register() {
    Promise.resolve(SPEFileDrop.register(window));
  }
}

module.exports = {
  default: Components,
  Components
};
