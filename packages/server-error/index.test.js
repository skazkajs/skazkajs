const App = require('@skazka/server');
const srv = require('@skazka/server-http');

const error = require('.');

const { host, axios } = global;

describe('Server error handler test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test 404 error handler', async () => {
    app.then(error());

    await axios.get(host).catch((err) => {
      expect(err.response.status).toEqual(404);
      expect(err.response.statusText).toEqual('Not Found');
      expect(err.response.data).toEqual('Not Found');
    });
  });

  test('It should test disabled 404 error handler', async () => {
    app.then(error({ hasUserError: false }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test 404 error handler json', async () => {
    app.then(error({ isJSON: true }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Not Found');
    });
  });

  test('It should test 404 error handler without error', async () => {
    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });

  test('It should test 404 error handler without error json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.headers['content-type']).toEqual('application/json');
  });

  test('It should test 404 error handler with 3 requests', async () => {
    app.then(error());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
    });
  });

  test('It should test 404 error handler with 3 requests json', async () => {
    app.then(error({ isJSON: true }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Not Found');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Not Found');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Not Found');
    });
  });


  test('It should test 500 error handler with app.then', async () => {
    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test disabled 500 error handler with app.then', async () => {
    app.then(error({ hasServerError: false }));

    app.then(async () => {
      throw new Error('test');
    });

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 500;
      ctx.res.end(err.message);
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.then json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.then json without message', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });
  });

  test('It should test 500 error handler with app.all', async () => {
    app.all([error()]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.all json', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.all json without message', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });
  });

  test('It should test 500 error handler without error', async () => {
    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });
    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
    });
  });

  test('It should test 500 error handler without error json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test 500 error handler with app.then with 3 requests', async () => {
    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.then with 3 requests json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.then with 3 requests json without message', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });
  });

  test('It should test 500 error handler with app.all with 3 requests', async () => {
    app.all([
      error(),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.all with 3 requests json', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('test');
    });
  });

  test('It should test 500 error handler with app.all with 3 requests json without message', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.headers['content-type']).toEqual('application/json');
      expect(response.data.message).toEqual('Internal Server Error');
    });
  });

  test('It should test error code', async () => {
    app.then(error());

    app.then(async () => {
      const err = new Error();
      err.code = 403;

      return Promise.reject(err);
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(403);
      expect(response.statusText).toEqual('Forbidden');
      expect(response.data).toEqual('Forbidden');
    });
  });

  test('It should test finished response', async () => {
    app.then(error());

    app.then(async (ctx) => {
      ctx.res.end('finished');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('finished');
    });
  });
});
