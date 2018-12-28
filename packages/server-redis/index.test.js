const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const redis = require('.');
const storage = require('./redis');

const { host, axios } = global;

describe('Server redis test', async () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      redis(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  afterAll(() => {
    storage.disconnect();
  });

  test('It should test middleware', async () => {
    app.then(async (ctx) => {
      await ctx.redis.set('test', 'test');

      const data = await ctx.redis.get('test');

      expect(data).toEqual('test');

      ctx.res.statusCode = 200;
      ctx.res.end(data);
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test router', async () => {
    router.catch().then(async (ctx) => {
      await ctx.redis.set('test', 'test');

      const data = await ctx.redis.get('test');

      expect(data).toEqual('test');

      ctx.res.writeHead(200);
      ctx.res.end(data);
    });

    app.then(router.resolve());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test storage', async () => {
    await storage.set('test', 'test');

    const data = await storage.get('test');

    expect(data).toEqual('test');

    await storage.del('test');
  });
});
