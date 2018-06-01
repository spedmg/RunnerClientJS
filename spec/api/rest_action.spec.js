import { RestAction } from '../../src/api/rest_action';
import moxios from 'moxios';

describe('RestAction', () => {
  let subject;

  beforeEach(() => {
    moxios.install();
    subject = class extends RestAction {};
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('RestAction.post', () => {
  });
});
