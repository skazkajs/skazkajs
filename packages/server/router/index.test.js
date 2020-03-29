const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const request = require('@skazka/server-request'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const Router = require('.');

describe('Server response test', () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      request(),
      response(),
    ]);

    router = new Router();
    app.then(router.resolve());

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test catch', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test all', async () => {
    router.all('/test').then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    await axios.post(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    await axios.head(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });

    await axios.put(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    await axios.delete(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with url', async () => {
    router.catch({ url: '/test' }).then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.get(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with method', async () => {
    router.catch({ method: 'GET' }).then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.post(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with method and url', async () => {
    router.catch({ method: 'GET', url: '/test' }).then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.post(`${host}/test`).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.get(`${host}/test`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with head', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.head(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });

  it('It should test catch with options', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.options(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with post', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.post(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with put', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.post(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.put(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with patch', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.post(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.patch(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with delete', async () => {
    router.catch().then((ctx) => ctx.response('homepage'));
    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.post(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    await axios.delete(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });
  });

  it('It should test catch with params', async () => {
    const mockThen = sinon.spy();

    router.catch({ url: '/test/:id1/:id2' }).then(async (ctx) => {
      if (ctx.request.params.id1 === '1' && ctx.request.params.id2 === '2') {
        mockThen();
      }

      return ctx.response('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    expect(mockThen.called).is.false();

    await axios.get(`${host}/test/1`).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    expect(mockThen.called).is.false();

    await axios.post(`${host}/test/1/2`).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.data).equal('Not Found');
    });

    expect(mockThen.called).is.true();

    await axios.get(`${host}/test/1/2`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test catch with query', async () => {
    const mockThen = sinon.spy();

    router.catch({ url: '/test' }).then(async (ctx) => {
      if (ctx.request.query.id1 === '1' && ctx.request.query.id2 === '2') {
        mockThen();
      }

      return ctx.response('homepage');
    });

    app.then(router.resolve());

    await axios.get(`${host}/test?id1=1&id2=2`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test catch with params and query', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();

    router.catch({ url: '/test/:id1/:id2' }).then(async (ctx) => {
      if (ctx.request.params.id1 === '1' && ctx.request.params.id2 === '2') {
        mockThen1();
      }

      if (ctx.request.query.id1 === '1' && ctx.request.query.id2 === '2') {
        mockThen2();
      }

      return ctx.response('homepage');
    });

    app.then(router.resolve());

    await axios.get(`${host}/test/1/2?id1=1&id2=2`).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('homepage');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.true();
  });
});
