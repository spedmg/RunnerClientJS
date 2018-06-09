/*
 * This is the webpack entry file for all specs. It is run by the karma server.
 */
function requireAll(r) {
  'use strict';
  r.keys().forEach((key) => {
    r(key);
  });
}
require('babel-polyfill');
require('@webcomponents/webcomponentsjs/webcomponents-bundle.js');

window.WebComponents.waitFor = (cb) => { cb(); };

requireAll(require.context('./helpers', true, /\.js$/));
requireAll(require.context('./mocks', true, /\.js$/));
requireAll(require.context('../', true, /\.spec\.js$/));
