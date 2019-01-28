const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const requestModule = require('.');
const Request = require('./request');

const { host, axios } = global;

describe('Server request test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();

    app.all([
      error(),
      response(),
      requestModule(),
    ]);

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test request', async () => {
    const request = new Request();

    const that = request.set('test', 'test');

    expect(request).toEqual(that);
    expect(request.test).toEqual('test');
    expect(request.get('test')).toEqual('test');
  });

  test('It should test request with existing value', async () => {
    const mock = jest.fn();

    const request = new Request();

    request.set('test', 'test');

    try {
      request.set('test', 'newTest');
    } catch (e) {
      expect(e.message).toEqual('Value for test already set!');
      mock();
    }

    expect(mock).toHaveBeenCalled();
  });

  test('It should test request with existing value and rewrite', async () => {
    const mock = jest.fn();

    const request = new Request();

    request.set('test', 'test');

    try {
      request.set('test', 'newTest', true);
    } catch (e) {
      mock();
    }

    expect(mock).not.toHaveBeenCalled();
    expect(request.get('test')).toEqual('newTest');
  });

  test('It should test request module', async () => {
    app.then(async (ctx) => {
      const req = ctx.get('request');

      expect(req.get('headers').accept).toEqual('application/json, text/plain, */*');
      expect(req.get('headers')['user-agent']).toEqual('axios/0.18.0');
      expect(req.get('aborted')).toEqual(false);
      expect(req.get('url')).toEqual('/');
      expect(req.get('method')).toEqual('GET');
      expect(req.get('statusCode')).toEqual(null);
      expect(req.get('statusMessage')).toEqual(null);
      expect(req.get('httpVersionMajor')).toEqual(1);
      expect(req.get('httpVersionMinor')).toEqual(1);
      expect(req.get('httpVersion')).toEqual('1.1');
      expect(req.get('complete')).toEqual(false);

      return ctx.response('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('test');
    });
  });
});
