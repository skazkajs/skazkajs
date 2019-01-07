const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const helmet = require('.');

const { host, axios } = global;

describe('Server helmet test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      response(),
    ]);
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test helmet', async () => {
    app.then(helmet());

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

  test('It should test helmet with options', async () => {
    app.then(helmet({
      frameguard: {
        action: 'deny',
      },
    }));

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
      expect(res.headers['x-frame-options']).toEqual('DENY');
      expect(res.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).toEqual('noopen');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test helmet.contentSecurityPolicy', async () => {
    app.then(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'default.com'],
      },
    }));

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['content-security-policy']).toEqual('default-src \'self\' default.com');
      expect(res.headers['x-content-security-policy']).toEqual('default-src \'self\' default.com');
      expect(res.headers['x-webkit-csp']).toEqual('default-src \'self\' default.com');
    });
  });

  test('It should test helmet.dnsPrefetchControl', async () => {
    app.then(helmet.dnsPrefetchControl());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-dns-prefetch-control']).toEqual('off');
    });
  });

  test('It should test helmet.expectCt', async () => {
    app.then(helmet.expectCt());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['expect-ct']).toEqual('max-age=0');
    });
  });

  test('It should test helmet.featurePolicy', async () => {
    app.then(helmet.featurePolicy({
      features: {
        fullscreen: ['"self"'],
      },
    }));

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['feature-policy']).toEqual('fullscreen "self"');
    });
  });

  test('It should test helmet.frameguard', async () => {
    app.then(helmet.frameguard());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-frame-options']).toEqual('SAMEORIGIN');
    });
  });

  test('It should test helmet.hidePoweredBy', async () => {
    app.then((ctx) => {
      ctx.res.setHeader('X-Powered-By', 'test');
    });
    app.then(helmet.hidePoweredBy());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['X-Powered-By']).toEqual(undefined);
    });
  });

  test('It should test helmet.hpkp', async () => {
    app.then(helmet.hpkp({
      maxAge: 7776000,
      sha256s: ['AbCdEf123=', 'ZyXwVu456='],
    }));

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['public-key-pins']).toEqual('pin-sha256="AbCdEf123="; pin-sha256="ZyXwVu456="; max-age=7776000');
    });
  });

  test('It should test helmet.hsts', async () => {
    app.then(helmet.hsts({
      maxAge: 7776000,
    }));

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['strict-transport-security']).toEqual('max-age=7776000; includeSubDomains');
    });
  });

  test('It should test helmet.ieNoOpen', async () => {
    app.then(helmet.ieNoOpen());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-download-options']).toEqual('noopen');
    });
  });

  test('It should test helmet.noCache', async () => {
    app.then(helmet.noCache());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['surrogate-control']).toEqual('no-store');
      expect(res.headers['cache-control']).toEqual('no-store, no-cache, must-revalidate, proxy-revalidate');
    });
  });

  test('It should test helmet.noSniff', async () => {
    app.then(helmet.noSniff());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-content-type-options']).toEqual('nosniff');
    });
  });

  test('It should test helmet.permittedCrossDomainPolicies', async () => {
    app.then(helmet.permittedCrossDomainPolicies());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-permitted-cross-domain-policies']).toEqual('none');
    });
  });

  test('It should test helmet.referrerPolicy', async () => {
    app.then(helmet.referrerPolicy());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['referrer-policy']).toEqual('no-referrer');
    });
  });

  test('It should test helmet.xssFilter', async () => {
    app.then(helmet.xssFilter());

    app.then(ctx => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });
});
