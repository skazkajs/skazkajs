const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const cookies = require('.');

const { host, axios } = global;

describe('Server cookies parser test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      cookies(),
      response(),
    ]);

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test empty cookies', async () => {
    app.then(async (ctx) => {
      expect(ctx.request.cookies).toEqual({});

      return ctx.response();
    });

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
    });
  });

  test('It should test cookies parser', async () => {
    app.then(async (ctx) => {
      expect(ctx.request.cookies.data).toEqual('test');
      expect(ctx.request.cookies.test).toEqual('test');

      ctx.setHeader('Set-Cookie', 'data=test');

      return ctx.response();
    });

    await axios.get(host, { headers: { Cookie: 'data=test;test=test' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['set-cookie']).toEqual(['data=test']);
    });
  });
});
