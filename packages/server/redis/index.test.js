const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const redis = require('.');
const storage = require('./redis');

describe('Server redis test', async () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      redis(),
      response(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  after(() => {
    storage.disconnect();
  });

  it('It should test middleware', async () => {
    app.then(async (ctx) => {
      await ctx.redis.set('test', 'test');

      const data = await ctx.redis.get('test');

      expect(data).equal('test');

      return ctx.response(data);
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test router', async () => {
    router.catch().then(async (ctx) => {
      await ctx.redis.set('test', 'test');

      const data = await ctx.redis.get('test');

      expect(data).equal('test');

      return ctx.response(data);
    });

    app.then(router.resolve());

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test storage', async () => {
    await storage.set('test', 'test');

    const data = await storage.get('test');

    expect(data).equal('test');

    await storage.del('test');
  });
});
