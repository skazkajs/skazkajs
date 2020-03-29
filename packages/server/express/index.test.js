const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const expressWrapper = require('.');

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

  it('It should test next()', async () => {
    app.then(expressWrapper((req, res, next) => {
      next();
    }));

    app.then((ctx) => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test wrapper in code', async () => {
    app.then(async (ctx) => {
      const wrapper = expressWrapper((req, res, next) => {
        next();
      });

      await wrapper(ctx);
    });

    app.then((ctx) => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test next(error)', async () => {
    app.all([
      error(),
    ]);

    app.then(expressWrapper((req, res, next) => {
      next(new Error('error'));
    }));

    app.then((ctx) => ctx.response('test'));

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('error');
    });
  });

  it('It should test without next = res.end()', async () => {
    app.then(expressWrapper((req, res) => {
      res.statusCode = 200;
      res.end('next');
    }));

    app.then((ctx) => ctx.response('test'));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('next');
    });
  });
});
