const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const expressWrapper = require('.');

const { host, axios } = global;

describe('Server response test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test next()', async () => {
    app.then(expressWrapper((req, res, next) => {
      next();
    }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test wrapper in code', async () => {
    app.then(async (ctx) => {
      const wrapper = expressWrapper((req, res, next) => {
        next();
      });

      await wrapper(ctx);
    });

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test next(error)', async () => {
    app.all([
      error(),
    ]);

    app.then(expressWrapper((req, res, next) => {
      next(new Error('error'));
    }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('error');
    });
  });

  test('It should test without next = res.end()', async () => {
    app.then(expressWrapper((req, res) => {
      res.statusCode = 200;
      res.end('next');
    }));

    app.then(async (ctx) => {
      ctx.res.writeHead(200);
      ctx.res.end('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('next');
    });
  });
});
