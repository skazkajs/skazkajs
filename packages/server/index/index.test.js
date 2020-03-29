const { resolve } = require('path');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const index = require('.');

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

  it('It should test serving', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test serving with default parameters', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
    }));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test cache', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');

      expect(response.headers['surrogate-control']).equal('no-store');
      expect(response.headers['cache-control']).equal('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers.pragma).equal('no-cache');
      expect(response.headers.expires).equal('0');
      expect(response.headers['content-type']).equal('text/html;charset=UTF-8');
    });
  });

  it('It should test redirect', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    await axios.get(`${host}/index.html`, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(301);
      expect(response.statusText).equal('Moved Permanently');
      expect(response.data).contain('');

      expect(response.headers.location).equal('/');
      expect(response.headers['content-length']).equal('1');
      expect(response.headers.connection).equal('close');
    });
  });

  it('It should test 404', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index1.html',
      url: '/',
    }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('');

      expect(response.headers['content-length']).equal('9');
      expect(response.headers.connection).equal('close');
    });
  });

  it('It should test 404 for other request', async () => {
    app.then(index({
      root: resolve(__dirname, 'files'),
    }));

    await axios.get(`${host}/test`).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('');

      expect(response.headers['content-length']).equal('9');
      expect(response.headers.connection).equal('close');
    });
  });

  it('It should test next then', async () => {
    const mock = sinon.spy();

    app.then(index({
      root: resolve(__dirname, 'files'),
      index: 'index.html',
      url: '/',
    }));

    app.then(async () => {
      mock();
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });

    expect(mock.called).is.false();
  });

  it('It should test empty root', async () => {
    app.then(index());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data).contain('The "root" parameter is required!');
    });
  });
});
