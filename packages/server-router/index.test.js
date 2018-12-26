const App = require('@skazka/server');
const error = require('@skazka/server-error');
const srv = require('@skazka/server-http');

const Router = require('.');

const { host, axios } = global;

describe('Server response test', () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
    ]);

    router = new Router();
    app.then(router.resolve());

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test catch', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test all', async () => {
    router.all('/test').then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    await axios.post(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    await axios.head(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });

    await axios.put(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    await axios.delete(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with url', async () => {
    router.catch({ url: '/test' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.get(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with method', async () => {
    router.catch({ method: 'GET' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.post(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with method and url', async () => {
    router.catch({ method: 'GET', url: '/test' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.post(`${host}/test`).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.get(`${host}/test`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with head', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.head(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
    });
  });

  test('It should test catch with options', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.options(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with post', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.post(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with put', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.post(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.put(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with patch', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.post(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.patch(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with delete', async () => {
    router.catch().then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');
    });
    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.post(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    await axios.delete(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });
  });

  test('It should test catch with params', async () => {
    const mockThen = jest.fn();

    router.catch({ url: '/test/:id1/:id2' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');

      if (ctx.request.params.id1 === '1' && ctx.request.params.id2 === '2') {
        mockThen();
      }
    });

    app.then(router.resolve());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    expect(mockThen).not.toHaveBeenCalled();

    await axios.get(`${host}/test/1`).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    expect(mockThen).not.toHaveBeenCalled();

    await axios.post(`${host}/test/1/2`).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('Not Found');
    });

    expect(mockThen).toHaveBeenCalled();

    await axios.get(`${host}/test/1/2`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test catch with query', async () => {
    const mockThen = jest.fn();

    router.catch({ url: '/test' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');

      if (ctx.request.query.id1 === '1' && ctx.request.query.id2 === '2') {
        mockThen();
      }
    });

    app.then(router.resolve());

    await axios.get(`${host}/test?id1=1&id2=2`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test catch with params and query', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();

    router.catch({ url: '/test/:id1/:id2' }).then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('homepage');

      if (ctx.request.params.id1 === '1' && ctx.request.params.id2 === '2') {
        mockThen1();
      }

      if (ctx.request.query.id1 === '1' && ctx.request.query.id2 === '2') {
        mockThen2();
      }
    });

    app.then(router.resolve());

    await axios.get(`${host}/test/1/2?id1=1&id2=2`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('homepage');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).toHaveBeenCalled();
  });
});
