const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const errorHandler = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const logger = require('.');

const { host, axios } = global;

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

  test('It should test access from middleware', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.logger).not.toEqual(undefined);

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should run 3 times', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.logger).not.toEqual(undefined);

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test access from router', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    const router = new Router();

    router.catch().then(async (ctx) => {
      expect(ctx.logger).not.toEqual(undefined);

      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    app.then(router.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test middleware', async () => {
    const spy = jest.spyOn(console, 'error');

    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('It should test middleware with resolve', async () => {
    const spy = jest.spyOn(console, 'warn');

    app = new App();
    app.all([
      errorHandler(),
      logger(),
    ]);

    app.then(() => Promise.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  test('It should test wrong logger object', async () => {
    app = new App();
    app.all([
      errorHandler(),
      logger({}),
    ]);

    server = srv.createHttpServer(app);

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('Logger doesn\'t have "warn" and "error" methods!');
    });
  });
});
