const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const bodyParser = require('.');

const { host, axios } = global;

describe('Server bodyParser test', () => {
  let app;
  let server;

  afterEach((done) => {
    server.close(done);
  });

  test('It should test json', async () => {
    app = new App();
    app.then(bodyParser.json());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { data: 'test' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test json in code', async () => {
    app = new App();

    app.then(async (ctx) => {
      await bodyParser.json(ctx);

      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { data: 'test' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test raw', async () => {
    app = new App();
    app.then(bodyParser.raw());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.toString());
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'application/octet-stream' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual({ data: 'test' });
    });
  });

  test('It should test raw in code', async () => {
    app = new App();

    app.then(async (ctx) => {
      await bodyParser.raw(ctx);

      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.toString());
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'application/octet-stream' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual({ data: 'test' });
    });
  });

  test('It should test text', async () => {
    app = new App();
    app.then(bodyParser.text());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'text/plain' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual({ data: 'test' });
    });
  });

  test('It should test text in code', async () => {
    app = new App();

    app.then(async (ctx) => {
      await bodyParser.text(ctx);

      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'text/plain' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual({ data: 'test' });
    });
  });

  test('It should test urlencoded', async () => {
    app = new App();
    app.then(bodyParser.urlencoded({ extended: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, 'data=test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test urlencoded in code', async () => {
    app = new App();

    app.then(async (ctx) => {
      await bodyParser.urlencoded(ctx, { extended: true });

      ctx.res.statusCode = 200;
      ctx.res.end(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, 'data=test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });
});
