const config = require('config');

const App = require('@skazka/server');
const srv = require('@skazka/server-http');

const chaos = require('.');

const { host, axios } = global;

describe('Server chaos test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test disabled', async () => {
    config.chaos.enabled = false;

    app.then(chaos());
    app.then(async (ctx) => {
      ctx.res.end();
    });

    await axios.get(host).then((data) => {
      expect(data.status).toEqual(200);
      expect(data.statusText).toEqual('OK');
    });
  });

  test('It should test enable with error', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 0;
    config.chaos.error.probability = 1;

    app.then(chaos());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['x-chaos']).toEqual('1');
      expect(response.headers['x-chaos-error']).toEqual('1');
      expect(response.data).toEqual('Chaos');
    });
  });

  test('It should test enable with error and response', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 0;
    config.chaos.error.probability = 1;

    const mockThen = jest.fn();
    const mockCatch = jest.fn();

    app.then(chaos());
    app.then(async () => {
      mockThen();
    });
    app.catch(async () => {
      mockCatch();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['x-chaos']).toEqual('1');
      expect(response.headers['x-chaos-error']).toEqual('1');
      expect(response.data).toEqual('Chaos');
    });

    expect(mockThen).not.toHaveBeenCalled();
    expect(mockCatch).not.toHaveBeenCalled();
  });

  test('It should test enable with timeout', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 1;
    config.chaos.timeout.time = 1;
    config.chaos.error.probability = 0;

    const mockThen = jest.fn();

    app.then(chaos());
    app.then(async (ctx) => {
      mockThen();
      ctx.res.end();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.headers['x-chaos']).toEqual('1');
      expect(response.headers['x-chaos-timeout']).toEqual('1');
      expect(response.data).toEqual('');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test enable all', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 1;
    config.chaos.timeout.time = 1;
    config.chaos.error.probability = 1;

    const mockThen = jest.fn();

    app.then(chaos());
    app.then(async (ctx) => {
      mockThen();
      ctx.res.end();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['x-chaos']).toEqual('1');
      expect(response.headers['x-chaos-error']).toEqual('1');
      expect(response.data).toEqual('Chaos');
    });

    expect(mockThen).not.toHaveBeenCalled();
  });
});
