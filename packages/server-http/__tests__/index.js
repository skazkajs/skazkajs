const { readFileSync } = require('fs');
const { resolve } = require('path');
const https = require('https');
const util = require('util');

const pem = require('pem'); //  eslint-disable-line

const App = require('@skazka/server'); //  eslint-disable-line

const server = require('..');

const { host, hostSSL, axios } = global;

const createCertificate = util.promisify(pem.createCertificate);

describe('Server HTTP(s) test', () => {
  const { exit } = process;
  let app;
  let srv;

  beforeEach(() => {
    app = new App();
    Object.defineProperty(process, 'exit', {
      value: () => {
      },
    });
  });

  afterEach((done) => {
    Object.defineProperty(process, 'exit', {
      value: exit,
    });
    srv.close(done);
  });

  test('It should test http server', async () => {
    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    srv = server.createHttpServer(app);

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test http server with custom port', async () => {
    const port = parseInt(process.env.PORT || '3000', 10);

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    srv = server.createHttpServer(app, port);

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test https server', async () => {
    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const options = {
      key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
      cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem')),
    };

    srv = server.createHttpsServer(options, app);

    const data = await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test https server with pem', async () => {
    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    srv = server.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((data) => {
      expect(data.status).toEqual(200);
      expect(data.statusText).toEqual('OK');
    });
  });

  test('It should test https server with custom port', async () => {
    const port = parseInt(process.env.PORT || '3000', 10);

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    srv = server.createHttpsServer({ key, cert }, app, port);

    await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((data) => {
      expect(data.status).toEqual(200);
      expect(data.statusText).toEqual('OK');
    });
  });
});
