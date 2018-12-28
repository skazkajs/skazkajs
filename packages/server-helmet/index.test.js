const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const helmet = require('.');

const { host, axios } = global;

describe('Server helmet', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test helmet', async () => {
    app.then(helmet());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });

  test('It should test helmet with options', async () => {
    app.then(helmet({
      frameguard: {
        action: 'deny',
      },
    }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('DENY');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
    });
  });
});
