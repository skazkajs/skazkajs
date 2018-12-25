const { readFileSync } = require('fs');
const { resolve } = require('path');

const pem = require('pem');

const App = require('@skazka/server');

const server = require('..');

const { host, hostSSL, axios } = global;

describe('Server HTTP(s) testing', () => {
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

    const data = await axios.get(hostSSL);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test https server with pem', (done) => {
    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const days = 1;
    const selfSigned = true;

    pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
      if (err) {
        throw err;
      }
      srv = server.createHttpsServer({ key, cert }, app);

      axios.get(hostSSL).then((data) => {
        expect(data.status).toEqual(200);
        expect(data.statusText).toEqual('OK');

        done();
      });
    });
  });
});
