const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line
const request = require('@skazka/server-request'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const bodyParser = require('@skazka/server-body-parser'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const methodOverride = require('.');

describe('Server methodOverride test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      response(),
      error(),
    ]);

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test origin method', async () => {
    app.all([
      request(),
      methodOverride(),
    ]);

    app.then((ctx) => ctx.response(ctx.get('request').get('method')));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('GET');
    });
  });

  it('It should test get _method', async () => {
    app.then(request());
    app.then(methodOverride('_method'));

    app.then((ctx) => ctx.response(ctx.request.method));

    await axios.post(`${host}/?_method=PATCH`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('PATCH');
    });
  });

  it('It should test body method', async () => {
    app.then(request());
    app.then(bodyParser.json());
    app.then(methodOverride((req) => req.body.method));

    app.then((ctx) => ctx.response(ctx.request.method));

    await axios.post(host, { method: 'get' }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('GET');
    });
  });

  it('It should test body method in module', async () => {
    app.then(request());

    app.then(async (ctx) => {
      await bodyParser.json(ctx);
      await methodOverride(ctx, (req) => req.body.method);

      return ctx.response(ctx.request.method);
    });

    await axios.post(host, { method: 'get' }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('GET');
    });
  });

  it('It should test X-HTTP-Method-Override', async () => {
    app.then(request());
    app.then(methodOverride());

    app.then((ctx) => ctx.response(ctx.request.method));

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('DELETE');
    });
  });

  it('It should test header X-HTTP-Method-Override', async () => {
    app.then(request());
    app.then(methodOverride('X-HTTP-Method-Override'));

    app.then((ctx) => ctx.response(ctx.request.method));

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('DELETE');
    });
  });

  it('It should test header X-Method-Override', async () => {
    app.then(request());
    app.then(methodOverride('X-Method-Override'));

    app.then((ctx) => ctx.response(ctx.request.method));

    await axios.post(host, {}, { headers: { 'X-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('DELETE');
    });
  });

  it('It should test module', async () => {
    app.then(request());

    app.then(async (ctx) => {
      await methodOverride(ctx);

      return ctx.response(ctx.get('request').get('method'));
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('GET');
    });
  });

  it('It should test without request', async () => {
    app.then(async (ctx) => {
      await methodOverride(ctx);

      expect(ctx.get('request')).equal(undefined);

      return ctx.response(ctx.get('req').method);
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('GET');
    });
  });
});
