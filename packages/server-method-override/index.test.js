const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const bodyParser = require('@skazka/server-body-parser'); //  eslint-disable-line

const methodOverride = require('.');

const { host, axios } = global;

describe('Server methodOverride test', () => {
  let app;
  let server;

  afterEach((done) => {
    server.close(done);
  });

  test('It should test origin method', async () => {
    app = new App();
    app.all([
      response(),
      methodOverride(),
    ]);

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('GET');
    });
  });

  test('It should test get _method', async () => {
    app = new App();
    app.then(response());
    app.then(methodOverride('_method'));

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.post(`${host}/?_method=PATCH`).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('PATCH');
    });
  });

  test('It should test body method', async () => {
    app = new App();
    app.then(response());
    app.then(bodyParser.json());
    app.then(methodOverride(req => req.body.method));

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.post(host, { method: 'get' }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('GET');
    });
  });

  test('It should test body method in module', async () => {
    app = new App();
    app.then(response());
    app.then(bodyParser.json());
    app.then(methodOverride(req => req.body.method));

    app.then(async (ctx) => {
      await bodyParser.json(ctx);
      await methodOverride(ctx, req => req.body.method);

      return ctx.response(ctx.get('req').method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { method: 'get' }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('GET');
    });
  });

  test('It should test X-HTTP-Method-Override', async () => {
    app = new App();
    app.then(response());
    app.then(methodOverride());

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('DELETE');
    });
  });

  test('It should test header X-HTTP-Method-Override', async () => {
    app = new App();
    app.then(response());
    app.then(methodOverride('X-HTTP-Method-Override'));

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('DELETE');
    });
  });

  test('It should test header X-Method-Override', async () => {
    app = new App();
    app.then(response());
    app.then(methodOverride('X-Method-Override'));

    app.then(ctx => ctx.response(ctx.get('req').method));

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-Method-Override': 'DELETE' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('DELETE');
    });
  });
});
