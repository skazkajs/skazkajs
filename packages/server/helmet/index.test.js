const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const helmet = require('.');

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

  it('It should test helmet', async () => {
    app.then(helmet());

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

  it('It should test helmet with options', async () => {
    app.then(helmet({
      frameguard: {
        action: 'deny',
      },
    }));

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
      expect(res.headers['x-frame-options']).equal('DENY');
      expect(res.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(res.headers['x-download-options']).equal('noopen');
      expect(res.headers['x-content-type-options']).equal('nosniff');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });

  it('It should test helmet.contentSecurityPolicy', async () => {
    app.then(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'default.com'],
      },
    }));

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['content-security-policy']).equal('default-src \'self\' default.com');
      expect(res.headers['x-content-security-policy']).equal('default-src \'self\' default.com');
      expect(res.headers['x-webkit-csp']).equal('default-src \'self\' default.com');
    });
  });

  it('It should test helmet.dnsPrefetchControl', async () => {
    app.then(helmet.dnsPrefetchControl());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-dns-prefetch-control']).equal('off');
    });
  });

  it('It should test helmet.expectCt', async () => {
    app.then(helmet.expectCt());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['expect-ct']).equal('max-age=0');
    });
  });

  it('It should test helmet.featurePolicy', async () => {
    app.then(helmet.featurePolicy({
      features: {
        fullscreen: ['"self"'],
      },
    }));

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['feature-policy']).equal('fullscreen "self"');
    });
  });

  it('It should test helmet.frameguard', async () => {
    app.then(helmet.frameguard());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-frame-options']).equal('SAMEORIGIN');
    });
  });

  it('It should test helmet.hidePoweredBy', async () => {
    app.then((ctx) => {
      ctx.res.setHeader('X-Powered-By', 'test');
    });
    app.then(helmet.hidePoweredBy());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['X-Powered-By']).equal(undefined);
    });
  });

  it('It should test helmet.hsts', async () => {
    app.then(helmet.hsts({
      maxAge: 7776000,
    }));

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['strict-transport-security']).equal('max-age=7776000; includeSubDomains');
    });
  });

  it('It should test helmet.ieNoOpen', async () => {
    app.then(helmet.ieNoOpen());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-download-options']).equal('noopen');
    });
  });

  it('It should test helmet.noSniff', async () => {
    app.then(helmet.noSniff());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-content-type-options']).equal('nosniff');
    });
  });

  it('It should test helmet.permittedCrossDomainPolicies', async () => {
    app.then(helmet.permittedCrossDomainPolicies());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-permitted-cross-domain-policies']).equal('none');
    });
  });

  it('It should test helmet.referrerPolicy', async () => {
    app.then(helmet.referrerPolicy());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['referrer-policy']).equal('no-referrer');
    });
  });

  it('It should test helmet.xssFilter', async () => {
    app.then(helmet.xssFilter());

    app.then((ctx) => ctx.response(''));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['x-xss-protection']).equal('1; mode=block');
    });
  });
});
