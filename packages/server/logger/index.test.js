const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const errorHandler = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const logger = require('.');

describe('Server logger test', () => {
  const { warn, error } = console;

  let app;
  let server;

  beforeEach(() => {
    console.warn = () => 1; // eslint-disable-line
    console.error = () => 1; // eslint-disable-line
  });

  afterEach((done) => {
    console.warn = warn; // eslint-disable-line
    console.error = error; // eslint-disable-line
    server.close(done);
  });

  it('It should test access from middleware', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.logger).not.equal(undefined);

      return ctx.response('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should run 3 times', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.logger).not.equal(undefined);

      return ctx.response('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test access from router', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
      response(),
    ]);

    const router = new Router();

    router.catch().then(async (ctx) => {
      expect(ctx.logger).not.equal(undefined);

      return ctx.response('test');
    });

    app.then(router.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test middleware', async () => {
    const spy = sinon.spy(console, 'error');

    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });

    expect(spy.called).is.true();
  });

  it('It should test middleware with resolve', async () => {
    const spy = sinon.spy(console, 'warn');

    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(() => Promise.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    expect(spy.called).is.true();
  });

  it('It should test wrong logger object', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger({}),
    ]);

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('Logger doesn\'t have "warn" and "error" methods!');
    });
  });

  it('It should test 2 times', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
      response(),
      logger(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.logger).not.equal(undefined);

      return ctx.response('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });
});
