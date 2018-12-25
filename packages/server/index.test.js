const http = require('http');
const request = require('supertest');
const pause = require('promise-pause-timeout');

const App = require('.');

describe('Server testing', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = http.createServer(app.resolve());
  });

  afterEach(() => {
    server.close();
  });

  test('It should test promise', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      expect(ctx.app).toEqual(app);

      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', contentType);
      ctx.res.end(text);
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);
    expect(response.headers['content-type']).toEqual(contentType);
  });

  test('It should test 3 calls', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', contentType);
      ctx.res.end(text);
    });

    const response1 = await request(server).get('/');

    expect(response1.statusCode).toBe(200);
    expect(response1.text).toEqual(text);
    expect(response1.headers['content-type']).toEqual(contentType);

    const response2 = await request(server).get('/');

    expect(response2.statusCode).toBe(200);
    expect(response2.text).toEqual(text);
    expect(response2.headers['content-type']).toEqual(contentType);

    const response3 = await request(server).get('/');

    expect(response3.statusCode).toBe(200);
    expect(response3.text).toEqual(text);
    expect(response3.headers['content-type']).toEqual(contentType);
  });

  test('It should test chain of promises', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      ctx.headers = {};
      ctx.headers['Content-Length'] = 4;
    }).then(async (ctx) => {
      ctx.headers['Content-Type'] = contentType;
    });

    app.then(async (ctx) => {
      ctx.res.writeHead(200, ctx.headers);
      ctx.res.end(text);
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);
    expect(response.headers['content-type']).toEqual(contentType);
    expect(response.headers['content-length']).toEqual('4');
  });

  test('It should test error handler', async () => {
    const text = 'error';

    app.then(async () => Promise.reject(new Error(text)));

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);
  });

  test('It should test error handler without Promise.reject()', async () => {
    const text = 'error';

    app.then(async () => {
      throw new Error(text);
    });

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);
  });

  test('It should test 2 error handlers', async () => {
    const text = 'error';

    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async () => Promise.reject(new Error(text)));

    app.catch(async (err, ctx) => {
      isTestFinished1 = true;

      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    }).catch(async () => {
      isTestFinished2 = true;
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);

    expect(isTestFinished1).toBe(true);
    expect(isTestFinished2).toBe(true);
  });

  test('It should test breaking of promises chain without catch', async () => {
    let isTestOk = true;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');

      return app.reject();
    });

    app.then(async () => {
      isTestOk = false;
    });

    app.catch(async () => {
      isTestOk = false;
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);

    expect(isTestOk).toBe(true);
  });

  test('It should test breaking of promises chain without catch with promise', async () => {
    let isTestOk = true;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');

      return Promise.reject();
    });

    app.then(async () => {
      isTestOk = false;
    });

    app.catch(async () => {
      isTestOk = false;
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);

    expect(isTestOk).toBe(true);
  });

  test('It should test breaking of promises chain with catch', async () => {
    let isTestOk = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');

      return app.reject(new Error('test'));
    });

    app.then(async () => {
      isTestOk = false;
    });

    app.catch(async (err) => {
      expect(err.message).toEqual('test');
      isTestOk = true;
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);

    expect(isTestOk).toBe(true);
  });

  test('It should test breaking of promises chain with catch with promise', async () => {
    let isTestOk = false;

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end('test');

      return Promise.reject(new Error('test'));
    });

    app.then(async () => {
      isTestOk = false;
    });

    app.catch(async (err) => {
      expect(err.message).toEqual('test');
      isTestOk = true;
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);

    expect(isTestOk).toBe(true);
  });

  test('It should test all', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.all([
      async (ctx) => {
        ctx.headers = {};
        ctx.headers['Content-Length'] = 4;
      },
      async (ctx) => {
        ctx.headers['Content-Type'] = contentType;
      },
    ]);

    app.then(async (ctx) => {
      ctx.res.writeHead(200, ctx.headers);
      ctx.res.end(text);
    });

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(text);
    expect(response.headers['content-type']).toEqual(contentType);
    expect(response.headers['content-length']).toEqual('4');
  });

  test('It should test race', async () => {
    app.race([
      async (ctx) => {
        ctx.res.statusCode = 200;
        ctx.res.end('test');
      },
      async (ctx) => {
        ctx.res.statusCode = 200;
        ctx.res.end('test');
      },
    ]);

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
  });

  test('It should test race without reject', async () => {
    app.race([
      async () => {
        await pause(10);
        throw new Error('test');
      },
      async (ctx) => {
        ctx.res.statusCode = 200;
        ctx.res.end('test');
      },
    ]);

    const response = await request(server).get('/');

    expect(response.statusCode).toBe(200);
  });
});
