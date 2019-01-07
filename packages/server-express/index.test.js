const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const expressWrapper = require('.');

const { host, axios } = global;

describe('Server response test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(response());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test next()', async () => {
    app.then(expressWrapper((req, res, next) => {
      next();
    }));

    app.then(ctx => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('test');
    });
  });

  test('It should test wrapper in code', async () => {
    app.then(async (ctx) => {
      const wrapper = expressWrapper((req, res, next) => {
        next();
      });

      await wrapper(ctx);
    });

    app.then(ctx => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('test');
    });
  });

  test('It should test next(error)', async () => {
    app.all([
      error(),
    ]);

    app.then(expressWrapper((req, res, next) => {
      next(new Error('error'));
    }));

    app.then(ctx => ctx.response('test'));

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).toEqual(500);
      expect(res.statusText).toEqual('Internal Server Error');
      expect(res.data).toEqual('error');
    });
  });

  test('It should test without next = res.end()', async () => {
    app.then(expressWrapper((req, res) => {
      res.statusCode = 200;
      res.end('next');
    }));

    app.then(ctx => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('next');
    });
  });
});
