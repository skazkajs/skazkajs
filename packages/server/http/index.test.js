const { readFileSync } = require('fs');
const { resolve } = require('path');
const https = require('https');
const util = require('util');

const pem = require('pem'); //  eslint-disable-line

const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line

const {
  expect,
  axios,
  host,
  hostSSL,
} = require('../../../test.config');

const server = require('.');

const createCertificate = util.promisify(pem.createCertificate);

describe('Server HTTP(s) test', () => {
  const { exit } = process;
  let app;
  let srv;

  beforeEach(() => {
    app = new App();
    app.then(response());
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

  it('It should test http server', async () => {
    app.then((ctx) => ctx.response());

    srv = server.createHttpServer(app);

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test http server with custom port', async () => {
    const port = parseInt(process.env.PORT || '3000', 10);

    app.then((ctx) => ctx.response());

    srv = server.createHttpServer(app, port);

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test https server', async () => {
    app.then((ctx) => ctx.response());

    const options = {
      key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
      cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem')),
    };

    srv = server.createHttpsServer(options, app);

    const data = await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test https server with pem', async () => {
    app.then((ctx) => ctx.response());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    srv = server.createHttpsServer({ key, cert }, app);

    await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((data) => {
      expect(data.status).equal(200);
      expect(data.statusText).equal('OK');
    });
  });

  it('It should test https server with custom port', async () => {
    const port = parseInt(process.env.PORT || '3000', 10);

    app.then((ctx) => ctx.response());

    const days = 1;
    const selfSigned = true;

    const { serviceKey: key, certificate: cert } = await createCertificate({ days, selfSigned });

    srv = server.createHttpsServer({ key, cert }, app, port);

    await axios.get(hostSSL, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }).then((data) => {
      expect(data.status).equal(200);
      expect(data.statusText).equal('OK');
    });
  });
});
