import { DEFAULT_HTTP_HEADERS } from '../../src/constants';
import { RestAction } from '../../src/api/rest_action';
import { Authentication } from '../../src/config/authentication';
import { Config } from '../../src/config';
import moxios from 'moxios';

describe('RestAction', () => {
  let subject;
  const authHeaders = { 'Authorization': 'Bearer fooBar' };
  const baseURI = 'https://foo.bar.baz';
  const defaultResponse = {
    status: 200,
    response: { foo: 'bar' }
  };
  const expectedHeaders = jasmine.objectContaining(
    Object.assign({}, DEFAULT_HTTP_HEADERS, authHeaders)
  );

  const expectRequestWith = (method, url, data = undefined, headers = expectedHeaders, response = defaultResponse) => {
    return new Promise(resolve => {
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();

        expect(request.config.method).toEqual(method);
        expect(request.config.url).toEqual(url);
        expect(request.config.headers).toEqual(headers);
        expect(request.config.data).toEqual(JSON.stringify(data));

        request.respondWith(response);
        resolve();
      });
    });
  };

  beforeEach(() => {
    moxios.install();
    subject = class extends RestAction {};
    spyOnProperty(Authentication, 'httpHeaders').and.returnValue(authHeaders);
    spyOnProperty(Config, 'baseURI').and.returnValue(baseURI);
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('RestAction.http', () => {
    it('configures an axios instance', () => {
      expect(subject.http.defaults.headers).toEqual(expectedHeaders);
      expect(subject.http.defaults.baseURL).toEqual(baseURI);
    });

    it('memoizes the axios instance', () => {
      let instance = subject.http;
      expect(subject.http).toEqual(instance);
    });
  });

  describe('RestAction.get()', () => {
    specify(async () => {
      let url = '/path/to/something';
      let data = { abc: 123, xyz: 987 };

      let promise = subject.post(url, data);

      await expectRequestWith('post', `${baseURI}${url}`, data);

      await promise.then((response) => {
        expect(response.status).toEqual(defaultResponse.status);
        expect(response.data).toEqual(defaultResponse.response);
      });
    });
  });

  describe('RestAction.post()', () => {
    specify(async () => {
      let url = '/path/to/something';
      let data = { abc: 123, xyz: 987 };

      let promise = subject.post(url, data);

      await expectRequestWith('post', `${baseURI}${url}`, data);

      await promise.then((response) => {
        expect(response.status).toEqual(defaultResponse.status);
        expect(response.data).toEqual(defaultResponse.response);
      });
    });
  });

  describe('RestAction.post()', () => {
    specify(async () => {
      let url = '/path/to/something';
      let data = { abc: 123, xyz: 987 };

      let promise = subject.post(url, data);

      await expectRequestWith('post', `${baseURI}${url}`, data);

      await promise.then((response) => {
        expect(response.status).toEqual(defaultResponse.status);
        expect(response.data).toEqual(defaultResponse.response);
      });
    });
  });
});
