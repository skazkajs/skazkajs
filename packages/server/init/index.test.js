const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const init = require('.');

describe('Server init test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test default params', async () => {
    app.then(init());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test enabled cookies', async () => {
    app.then(init({ cookies: true }));

    app.then((ctx) => {
      expect(ctx.request.cookies).eql({ data: 'test' });
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test;' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled cookies', async () => {
    app.then(init({ cookies: false }));

    app.then((ctx) => {
      expect(ctx.request.cookies).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled request', async () => {
    app.then(init({ request: false }));

    app.then((ctx) => {
      expect(ctx.request).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled response', async () => {
    app.then(init({ response: false }));

    app.then((ctx) => {
      expect(ctx.response).equal(undefined);
    });

    app.then((ctx) => {
      ctx.res.end('');

      return Promise.reject();
    });

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled logger', async () => {
    app.then(init({ logger: false }));

    app.then((ctx) => {
      expect(ctx.logger).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled error', async () => {
    app.then(init({ error: false }));

    app.then((ctx) => {
      expect(ctx.error).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test disabled helmet', async () => {
    app.then(init({ helmet: false }));

    app.then((ctx) => {
      expect(ctx.helmet).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test error params', async () => {
    app.then(init({ error: { hasServerError: false } }));

    app.then((ctx) => {
      expect(ctx.hasServerError).equal(undefined);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test logger params', async () => {
    app.then(init({ logger: console }));

    app.then((ctx) => {
      expect(ctx.logger).equal(console);
    });

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test helmet params', async () => {
    app.then(init({ helmet: { frameguard: { action: 'deny' } } }));

    app.then((ctx) => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-frame-options']).equal('DENY');
    });
  });
});
