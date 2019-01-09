const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const init = require('.');

const { host, axios } = global;

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

  test('It should test default params', async () => {
    app.then(init());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test enabled cookies', async () => {
    app.then(init({ cookies: true }));

    app.then((ctx) => {
      expect(ctx.request.cookies).toEqual({ data: 'test' });
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test;' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled cookies', async () => {
    app.then(init({ cookies: false }));

    app.then((ctx) => {
      expect(ctx.request.cookies).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled request', async () => {
    app.then(init({ request: false }));

    app.then((ctx) => {
      expect(ctx.request).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled response', async () => {
    app.then(init({ response: false }));

    app.then((ctx) => {
      expect(ctx.response).toEqual(undefined);
    });

    app.then((ctx) => {
      ctx.res.end('');

      return Promise.reject();
    });

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled logger', async () => {
    app.then(init({ logger: false }));

    app.then((ctx) => {
      expect(ctx.logger).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled error', async () => {
    app.then(init({ error: false }));

    app.then((ctx) => {
      expect(ctx.error).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test disabled helmet', async () => {
    app.then(init({ helmet: false }));

    app.then((ctx) => {
      expect(ctx.helmet).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test error params', async () => {
    app.then(init({ error: { hasServerError: false } }));

    app.then((ctx) => {
      expect(ctx.hasServerError).toEqual(undefined);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test logger params', async () => {
    app.then(init({ logger: console }));

    app.then((ctx) => {
      expect(ctx.logger).toEqual(console);
    });

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test helmet params', async () => {
    app.then(init({ helmet: { frameguard: { action: 'deny' } } }));

    app.then(ctx => ctx.response(''));

    await axios.get(host, { headers: { Cookie: 'data=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-frame-options']).toEqual('DENY');
    });
  });
});
