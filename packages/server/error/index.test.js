const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const error = require('.');

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

  it('It should test 404 error handler', async () => {
    app.then(error());

    await axios.get(host).catch((err) => {
      expect(err.response.status).equal(404);
      expect(err.response.statusText).equal('Not Found');
      expect(err.response.data).equal('Not Found');
    });
  });

  it('It should test disabled 404 error handler', async () => {
    app.then(error({ hasUserError: false }));
    app.then(response());

    app.then((ctx) => ctx.response(''));

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test 404 error handler json', async () => {
    app.then(error({ isJSON: true }));

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Not Found');
    });
  });

  it('It should test 404 error handler without error', async () => {
    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test 404 error handler without error json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
      return Promise.reject();
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.headers['content-type']).equal('application/json');
  });

  it('It should test 404 error handler with 3 requests', async () => {
    app.then(error());

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
    });
  });

  it('It should test 404 error handler with 3 requests json', async () => {
    app.then(error({ isJSON: true }));

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Not Found');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Not Found');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(404);
      expect(res.statusText).equal('Not Found');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Not Found');
    });
  });


  it('It should test 500 error handler with app.then', async () => {
    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test disabled 500 error handler with app.then', async () => {
    app.then(error({ hasServerError: false }));

    app.then(async () => {
      throw new Error('test');
    });

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 500;
      ctx.res.end(err.message);
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test 500 error handler with app.then json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });
  });

  it('It should test 500 error handler with app.then json without message', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });
  });

  it('It should test 500 error handler with app.all', async () => {
    app.all([error()]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test 500 error handler with app.all json', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });
  });

  it('It should test 500 error handler with app.all json without message', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });
  });

  it('It should test 500 error handler without error', async () => {
    app.then(error());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('');
    });
    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
    });
  });

  it('It should test 500 error handler without error json', async () => {
    app.then(error({ isJSON: true }));
    app.then(response());

    app.then((ctx) => ctx.response(''));

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.headers['content-type']).equal('application/json');
    });
  });

  it('It should test 500 error handler with app.then with 3 requests', async () => {
    app.then(error());

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test 500 error handler with app.then with 3 requests json', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });
  });

  it('It should test 500 error handler with app.then with 3 requests json without message', async () => {
    app.then(error({ isJSON: true }));

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });
  });

  it('It should test 500 error handler with app.all with 3 requests', async () => {
    app.all([
      error(),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.data).equal('test');
    });
  });

  it('It should test 500 error handler with app.all with 3 requests json', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('test');
    });
  });

  it('It should test 500 error handler with app.all with 3 requests json without message', async () => {
    app.all([
      error({ isJSON: true }),
    ]);

    app.then(async () => {
      throw new Error();
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(500);
      expect(res.statusText).equal('Internal Server Error');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.message).equal('Internal Server Error');
    });
  });

  it('It should test error code', async () => {
    app.then(error());

    app.then(async () => {
      const err = new Error();
      err.code = 403;

      return Promise.reject(err);
    });

    await axios.get(host).catch(({ response: res }) => {
      expect(res.status).equal(403);
      expect(res.statusText).equal('Forbidden');
      expect(res.data).equal('Forbidden');
    });
  });

  it('It should test finished response', async () => {
    app.then(error());

    app.then((ctx) => ctx.res.end('finished'));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('finished');
    });
  });

  it('It should test object to json with request', async () => {
    app.then(error({ isJSON: true }));
    app.then(response());

    app.then((ctx) => ctx.response({ data: 'test' }));

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.headers['content-type']).equal('application/json');
      expect(res.data.data).equal('test');
    });
  });
});
