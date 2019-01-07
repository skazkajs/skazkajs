const { resolve } = require('path');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const index = require('..');

const { host, axios } = global;

describe('Server static test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test serving', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });
  });

  test('It should test serving with default parameters', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
    }));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });
  });

  test('It should test cache', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');

      expect(response.headers['surrogate-control']).toEqual('no-store');
      expect(response.headers['cache-control']).toEqual('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers.pragma).toEqual('no-cache');
      expect(response.headers.expires).toEqual('0');
      expect(response.headers['content-type']).toEqual('text/html;charset=UTF-8');
    });
  });

  test('It should test redirect', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(`${host}/index.html`, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toContain('');

      expect(response.headers.location).toEqual('/');
      expect(response.headers['content-length']).toEqual('1');
      expect(response.headers.connection).toEqual('close');
    });
  });

  test('It should test 404', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index1.html',
      url: '/',
    }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toContain('');

      expect(response.headers['content-length']).toEqual('9');
      expect(response.headers.connection).toEqual('close');
    });
  });

  test('It should test 404 for other request', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
    }));

    await axios.get(`${host}/test`).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toContain('');

      expect(response.headers['content-length']).toEqual('9');
      expect(response.headers.connection).toEqual('close');
    });
  });

  test('It should test next then', async () => {
    const mock = jest.fn();

    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    app.then(async () => {
      mock();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });

    expect(mock).not.toHaveBeenCalled();
  });
});
