const https = require('https');
const pem = require('pem'); //  eslint-disable-line

const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const VirtualHost = require('.');

const { host, hostSSL, axios } = global;

describe('Server virtual host parser', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(error());
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test http method', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test all method for http', async () => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test https method', (done) => {
    const vhost = new VirtualHost();

    vhost.https('skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }

      server = srv.createHttpsServer({ key, cert }, app);

      axios.get(hostSSL, {
        headers: { Host: 'skazkajs.org' },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
        expect(response.data).toEqual('');

        done();
      });
    });
  });

  test('It should test all method for https', (done) => {
    const vhost = new VirtualHost();

    vhost.all('skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }

      server = srv.createHttpsServer({ key, cert }, app);

      axios.get(hostSSL, {
        headers: { Host: 'skazkajs.org' },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.statusText).toEqual('OK');
        expect(response.data).toEqual('');

        done();
      });
    });
  });

  test('It should test 404 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('api.skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });
  });

  test('It should test 500 error', async () => {
    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(async () => {
      throw new Error('test');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test router', async () => {
    const router = new Router();

    router.get('/').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    const vhost = new VirtualHost();

    vhost.http('skazkajs.org').then(router.resolve());

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test regexp string domain', async () => {
    const vhost = new VirtualHost();

    vhost.http('*.skazkajs.org').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'api.skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test regexp domain', async () => {
    const vhost = new VirtualHost();

    vhost.http(/skazkajs.org/).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test empty catch', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host, { headers: { Host: 'skazkajs.org' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test empty catch without header', async () => {
    const vhost = new VirtualHost();

    vhost.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(vhost.resolve());

    server = srv.createHttpServer(app);

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });
});
