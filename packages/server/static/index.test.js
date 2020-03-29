const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const VirtualHost = require('@skazka/server-virtual-host'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const serve = require('.');

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

  it('It should test etag', async () => {
    app.then(serve());

    await axios.get(`${host}/files/index.html`, { headers: { etag: '/index.html' } }).catch(({ response }) => {
      expect(response.status).equal(304);
      expect(response.statusText).equal('Not Modified');
      expect(response.data).equal('');
    });
  });

  it('It should test etag with If-None-Match', async () => {
    app.then(serve());

    await axios.get(`${host}/files/index.html`, { headers: { 'If-None-Match': '/index.html' } }).catch(({ response }) => {
      expect(response.status).equal(304);
      expect(response.statusText).equal('Not Modified');
      expect(response.data).equal('');
    });
  });

  it('It should test etag with If-Modified-Since', async () => {
    app.then(serve());

    await axios.get(`${host}/files/index.html`, { headers: { 'If-Modified-Since': '/index.html' } }).catch(({ response }) => {
      expect(response.status).equal(304);
      expect(response.statusText).equal('Not Modified');
      expect(response.data).equal('');
    });
  });

  it('It should test index file', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test disabled index file for /', async () => {
    app.then(serve({
      root: __dirname,
      index: false,
    }));

    await axios.get(`${host}/files/`).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('Not Found');
    });
  });

  it('It should test disabled index file', async () => {
    app.then(serve({
      root: __dirname,
      index: false,
    }));

    await axios.get(`${host}/files/index.html`).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('Not Found');
    });
  });

  it('It should test without gzip', async () => {
    app.then(serve({
      root: __dirname,
      gzip: false,
    }));

    await axios.get(`${host}/files/`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['content-encoding']).to.be.an('undefined');
    });
  });

  it('It should test 404', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/index.html`).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('Not Found');
    });
  });

  it('It should test 500', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/../../../../test.html`).catch(({ response }) => {
      expect(response.status).equal(403);
      expect(response.statusText).equal('Forbidden');
      expect(response.data).contain('Forbidden');
    });
  });

  it('It should test etag: false', async () => {
    app.then(serve({
      root: __dirname,
      etag: false,
    }));

    await axios.get(`${host}/files/`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers.etag).to.be.an('undefined');
    });
  });

  it('It should test maxage', async () => {
    app.then(serve({
      root: __dirname,
      maxage: 9000,
    }));

    await axios.get(`${host}/files/`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['cache-control']).equal('max-age=9');
    });
  });

  it('It should test deflate', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/`, { headers: { 'Accept-Encoding': 'gzip,deflate' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test gzip for directory', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/`, { headers: { 'Accept-Encoding': 'gzip' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test wrong method', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.delete(`${host}/files/index.html`).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('Not Found');
    });
  });

  it('It should test gzip', async () => {
    app.then(async (ctx) => {
      delete ctx.get('req').headers['accept-encoding'];
    });

    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/index.html`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test directory', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test directory without gzip', async () => {
    app.then(serve({
      root: __dirname,
      gzip: false,
    }));

    await axios.get(`${host}/files`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test virtual host with router from readme', async () => {
    const vhost = new VirtualHost();
    const router = new Router();

    router.get('/').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', 'application/json');
      ctx.res.end(JSON.stringify({ status: 'OK' }));
    });

    vhost
      .http('api.skazkaja.org')
      .then(router.resolve());

    vhost
      .http('static.skazkaja.org')
      .then(serve({
        root: __dirname,
      }));

    app.then(vhost.resolve());

    await axios.get(host, { headers: { Host: 'api.skazkaja.org' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.status).contain('OK');
    });

    await axios.get(`${host}/files/index.html`, { headers: { Host: 'static.skazkaja.org' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test request parameters', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/index.html?t=1`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test request parameters for directory', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files/?t=1`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });

  it('It should test request parameters for directory without /', async () => {
    app.then(serve({
      root: __dirname,
    }));

    await axios.get(`${host}/files?t=1`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
      expect(response.headers['transfer-encoding']).equal('chunked');
    });
  });
});
