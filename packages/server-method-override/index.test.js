const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line
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
    app.then(methodOverride());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('GET');
    });
  });

  test('It should test get _method', async () => {
    app = new App();
    app.then(methodOverride('_method'));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(`${host}/?_method=PATCH`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('PATCH');
    });
  });

  test('It should test body method', async () => {
    app = new App();
    app.then(bodyParser.json());
    app.then(methodOverride(req => req.body.method));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { method: 'get' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('GET');
    });
  });

  test('It should test body method in module', async () => {
    app = new App();
    app.then(bodyParser.json());
    app.then(methodOverride(req => req.body.method));

    app.then(async (ctx) => {
      await bodyParser.json(ctx);
      await methodOverride(ctx, req => req.body.method);

      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { method: 'get' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('GET');
    });
  });

  test('It should test X-HTTP-Method-Override', async () => {
    app = new App();
    app.then(methodOverride());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('DELETE');
    });
  });

  test('It should test header X-HTTP-Method-Override', async () => {
    app = new App();
    app.then(methodOverride('X-HTTP-Method-Override'));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-HTTP-Method-Override': 'DELETE' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('DELETE');
    });
  });

  test('It should test header X-Method-Override', async () => {
    app = new App();
    app.then(methodOverride('X-Method-Override'));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.req.method);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {}, { headers: { 'X-Method-Override': 'DELETE' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('DELETE');
    });
  });
});
