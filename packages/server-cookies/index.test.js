const App = require('@skazka/server'); //  eslint-disable-line
const request = require('@skazka/server-request'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const cookies = require('.');

const { host, axios } = global;

describe('Server cookies parser test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test empty cookies', async () => {
    app.all([
      request(),
      cookies(),
      response(),
    ]);

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
    app.all([
      request(),
      cookies(),
      response(),
    ]);

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

  test('It should test cookies in module', async () => {
    app.all([
      request(),
      response(),
    ]);

    app.then(async (ctx) => {
      const data = await cookies(ctx);

      expect(data.data).toEqual('test');
      expect(data.test).toEqual('test');

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

  test('It should test cookies without request', async () => {
    app.all([
      cookies(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.request).toEqual(undefined);

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
