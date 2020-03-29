const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const requestModule = require('.');
const Request = require('./request');

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

  it('It should test request', async () => {
    const request = new Request();

    const that = request.set('test', 'test');

    expect(request).equal(that);
    expect(request.test).equal('test');
    expect(request.get('test')).equal('test');
  });

  it('It should test request with existing value', async () => {
    const mock = sinon.spy();

    const request = new Request();

    request.set('test', 'test');

    try {
      request.set('test', 'newTest');
    } catch (e) {
      expect(e.message).equal('Value for test already set!');
      mock();
    }

    expect(mock.called).is.true();
  });

  it('It should test request with existing value and rewrite', async () => {
    const mock = sinon.spy();

    const request = new Request();

    request.set('test', 'test');

    try {
      request.set('test', 'newTest', true);
    } catch (e) {
      mock();
    }

    expect(mock.called).is.false();
    expect(request.get('test')).equal('newTest');
  });

  it('It should test request module', async () => {
    app.then(async (ctx) => {
      const req = ctx.get('request');

      expect(req.get('headers').accept).equal('application/json, text/plain, */*');
      expect(req.get('headers')['user-agent']).equal('axios/0.19.2');
      expect(req.get('aborted')).equal(false);
      expect(req.get('url')).equal('/');
      expect(req.get('method')).equal('GET');
      expect(req.get('statusCode')).equal(null);
      expect(req.get('statusMessage')).equal(null);
      expect(req.get('httpVersionMajor')).equal(1);
      expect(req.get('httpVersionMinor')).equal(1);
      expect(req.get('httpVersion')).equal('1.1');
      expect(req.get('complete')).equal(false);

      return ctx.response('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });
});
