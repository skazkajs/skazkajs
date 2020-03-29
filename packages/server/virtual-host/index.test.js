const https = require('https');
const util = require('util');
const pem = require('pem'); //  eslint-disable-line

const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
  hostSSL,
} = require('../../../test.config');

const VirtualHost = require('.');

const createCertificate = util.promisify(pem.createCertificate);

describe('Server virtual host test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      response(),
    ]);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test http method', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test all method for http', async () => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test https method', async () => {
    const vhost = new VirtualHost();

    vhost.https('skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    server = srv.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test all method for https', async () => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    server = srv.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test 404 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('api.skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });
  });

  it('It should test 500 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(async () => {
      throw new Error('test');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test router', async () => {
    const router = new Router();

    router.get('/').then((ctx) => ctx.response('data'));

    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(router.resolve());

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('data');
    });
  });

  it('It should test regexp string domain', async () => {
    const vhost = new VirtualHost();

    vhost.http('*.skazkajs.org').then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'api.skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test regexp domain', async () => {
    const vhost = new VirtualHost();

    vhost.http(/skazkajs.org/).then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test empty catch', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test empty catch without header', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then((ctx) => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test redirect from http to https', async () => {
    const mock = sinon.spy();

    const vhost = new VirtualHost();

    const port = parseInt(process.env.PORT || '3000', 10);

    app = new App();
    app.all([
      error(),
      response(),
    ]);

    vhost.http('skazkajs.org').then((ctx) => ctx.redirect('https://skazkajs.org/'));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app, port);

    const vhostSSL = new VirtualHost();

    const portSSL = parseInt(process.env.PORT || '3000', 10) + 1;

    const appSSL = new App();
    appSSL.all([
      error(),
      response(),
    ]);

    vhostSSL.https('skazkajs.org').then((ctx) => ctx.response('data'));

    appSSL.then(vhostSSL.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    const serverSSL = srv.createHttpsServer({ key, cert }, appSSL, portSSL);

    await axios.get(host, {
      headers: { Host: 'skazkajs.org' },
      maxRedirects: 0,
    }).catch(({ response: res }) => {
      expect(res.status).equal(301);
      expect(res.statusText).equal('Moved Permanently');
      expect(res.data).equal('https://skazkajs.org/');
      expect(res.headers.location).equal('https://skazkajs.org/');
      mock();
    });

    expect(mock.called).is.true();

    await axios.get(`https://localhost:${portSSL}`, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('data');

      return new Promise((r) => serverSSL.close(r));
    });
  });

  it('It should test subdomains', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then((ctx) => ctx.response('spa'));
    vhost.http('static.skazkajs.org').then((ctx) => ctx.response('static'));
    vhost.http('api.skazkajs.org').then((ctx) => ctx.response([{ id: 1 }]));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('spa');
    });

    await axios.get(host, { headers: { Host: 'static.skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('static');
    });

    await axios.get(host, { headers: { Host: 'api.skazkajs.org' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data[0].id).equal(1);
    });
  });
});
