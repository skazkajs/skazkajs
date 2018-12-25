const { readFileSync } = require('fs');
const { resolve } = require('path');

const request = require('supertest');
const pem = require('pem');

const App = require('@skazka/server');
const error = require('@skazka/server-error');

const server = require('..');

describe('Server HTTP(s) testing', () => {
  const stopServer = srv => new Promise(r => srv.close(r));

  const { exit } = process;
  let app;
  let srv;

  beforeEach(() => {
    app = new App();
    app.then(error());
    Object.defineProperty(process, 'exit', {
      value: () => {
      },
    });
  });

  afterEach(async () => {
    Object.defineProperty(process, 'exit', {
      value: exit,
    });
    await stopServer(srv);
  });

  test('It should test http server', async () => {
    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    srv = server.createHttpServer(app);

    const response = await request(srv).get('/');

    expect(response.statusCode).toBe(200);
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

    const response = await request(srv).get('/');

    expect(response.statusCode).toBe(200);
  });

  test('It should test http server with error', (done) => {
    let isTestFinished = false;

    Object.defineProperty(process, 'exit', {
      value: () => {
        isTestFinished = true;
      },
    });

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    srv = server.createHttpServer(app);

    process.emit('SIGTERM');

    setTimeout(() => {
      expect(isTestFinished).toEqual(true);
      done();
    }, 0);
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

      request(srv).get('/').then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
  });
});
