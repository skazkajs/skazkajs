const App = require('@skazka/server'); //  eslint-disable-line
const request = require('@skazka/server-request'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const cookies = require('.');

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

  it('It should test empty cookies', async () => {
    app.all([
      request(),
      cookies(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.request.cookies).eql({});

      return ctx.response();
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test cookies parser', async () => {
    app.all([
      request(),
      cookies(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.request.cookies.data).equal('test');
      expect(ctx.request.cookies.test).equal('test');

      ctx.setHeader('Set-Cookie', 'data=test');

      return ctx.response();
    });

    await axios.get(host, { headers: { Cookie: 'data=test;test=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['set-cookie']).eql(['data=test']);
    });
  });

  it('It should test cookies in module', async () => {
    app.all([
      request(),
      response(),
    ]);

    app.then(async (ctx) => {
      const data = await cookies(ctx);

      expect(data.data).equal('test');
      expect(data.test).equal('test');

      ctx.setHeader('Set-Cookie', 'data=test');

      return ctx.response();
    });

    await axios.get(host, { headers: { Cookie: 'data=test;test=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['set-cookie']).eql(['data=test']);
    });
  });

  it('It should test cookies without request', async () => {
    app.all([
      cookies(),
      response(),
    ]);

    app.then(async (ctx) => {
      expect(ctx.request).equal(undefined);

      ctx.setHeader('Set-Cookie', 'data=test');

      return ctx.response();
    });

    await axios.get(host, { headers: { Cookie: 'data=test;test=test' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['set-cookie']).eql(['data=test']);
    });
  });
});
