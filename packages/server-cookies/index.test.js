const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const cookies = require('.');

const { host, axios } = global;

describe('Server cookies parser test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(cookies());

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test empty cookies', async () => {
    app.then(async (ctx) => {
      expect(ctx.request.cookies).toEqual({});

      ctx.res.statusCode = 200;
      ctx.res.end();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test cookies parser', async () => {
    app.then(async (ctx) => {
      expect(ctx.request.cookies.data).toEqual('test');
      expect(ctx.request.cookies.test).toEqual('test');

      ctx.res.statusCode = 200;
      ctx.res.setHeader('Set-Cookie', 'data=test');
      ctx.res.end('');
    });

    await axios.get(host, { headers: { Cookie: 'data=test;test=test' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['set-cookie']).toEqual(['data=test']);
    });
  });
});
