const https = require('https');
const util = require('util');
const pem = require('pem'); //  eslint-disable-line

const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const VirtualHost = require('.');

const { host, hostSSL, axios } = global;

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

  test('It should test http method', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test all method for http', async () => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test https method', async () => {
    const vhost = new VirtualHost();

    vhost.https('skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    server = srv.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test all method for https', async () => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    server = srv.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test 404 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('api.skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response: res }) => {
      expect(res.status).toEqual(404);
      expect(res.statusText).toEqual('Not Found');
      expect(res.data).toEqual('Not Found');
    });
  });

  test('It should test 500 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(async () => {
      throw new Error('test');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response: res }) => {
      expect(res.status).toEqual(500);
      expect(res.statusText).toEqual('Internal Server Error');
      expect(res.data).toEqual('test');
    });
  });

  test('It should test router', async () => {
    const router = new Router();

    router.get('/').then(ctx => ctx.response('data'));

    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(router.resolve());

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('data');
    });
  });

  test('It should test regexp string domain', async () => {
    const vhost = new VirtualHost();

    vhost.http('*.skazkajs.org').then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'api.skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test regexp domain', async () => {
    const vhost = new VirtualHost();

    vhost.http(/skazkajs.org/).then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test empty catch', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test empty catch without header', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then(ctx => ctx.response(''));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test redirect from http to https', async () => {
    const mock = jest.fn();

    const vhost = new VirtualHost();

    const port = parseInt(process.env.PORT || '3000', 10);

    app = new App();
    app.all([
      error(),
      response(),
    ]);

    vhost.http('skazkajs.org').then(ctx => ctx.redirect('https://skazkajs.org/'));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app, port);

    const vhostSSL = new VirtualHost();

    const portSSL = parseInt(process.env.PORT || '3000', 10) + 1;

    const appSSL = new App();
    appSSL.all([
      error(),
      response(),
    ]);

    vhostSSL.https('skazkajs.org').then(ctx => ctx.response('data'));

    appSSL.then(vhostSSL.resolve());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    const serverSSL = srv.createHttpsServer({ key, cert }, appSSL, portSSL);

    await axios.get(host, {
      headers: { Host: 'skazkajs.org' },
      maxRedirects: 0,
    }).catch(({ response: res }) => {
      expect(res.status).toEqual(301);
      expect(res.statusText).toEqual('Moved Permanently');
      expect(res.data).toEqual('https://skazkajs.org/');
      expect(res.headers.location).toEqual('https://skazkajs.org/');
      mock();
    });

    expect(mock).toHaveBeenCalled();

    await axios.get(`https://localhost:${portSSL}`, {
      headers: { Host: 'skazkajs.org' },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('data');

      return new Promise(r => serverSSL.close(r));
    });
  });

  test('It should test subdomains', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(ctx => ctx.response('spa'));
    vhost.http('static.skazkajs.org').then(ctx => ctx.response('static'));
    vhost.http('api.skazkajs.org').then(ctx => ctx.response([{ id: 1 }]));

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('spa');
    });

    await axios.get(host, { headers: { Host: 'static.skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('static');
    });

    await axios.get(host, { headers: { Host: 'api.skazkajs.org' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data[0].id).toEqual(1);
    });
  });
});
