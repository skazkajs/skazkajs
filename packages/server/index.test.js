const http = require('http');
const pause = require('promise-pause-timeout');

const App = require('.');

const { host, axios } = global;

const port = parseInt(process.env.PORT || '3000', 10);

describe('Server testing', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = http.createServer(app.resolve());
    server.listen(port);
  });

  afterEach((done) => {
    server.close(done);
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual(text);
    expect(data.headers['content-type']).toEqual(contentType);
    expect(data.headers['content-length']).toEqual(text.length.toString());
  });

  test('It should test 3 calls', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', contentType);
      ctx.res.end(text);
    });

    const data1 = await axios.get(host);

    expect(data1.status).toEqual(200);
    expect(data1.statusText).toEqual('OK');
    expect(data1.data).toEqual(text);
    expect(data1.headers['content-type']).toEqual(contentType);
    expect(data1.headers['content-length']).toEqual(text.length.toString());

    const data2 = await axios.get(host);

    expect(data2.status).toEqual(200);
    expect(data2.statusText).toEqual('OK');
    expect(data2.data).toEqual(text);
    expect(data2.headers['content-type']).toEqual(contentType);
    expect(data2.headers['content-length']).toEqual(text.length.toString());

    const data3 = await axios.get(host);

    expect(data3.status).toEqual(200);
    expect(data3.statusText).toEqual('OK');
    expect(data3.data).toEqual(text);
    expect(data3.headers['content-type']).toEqual(contentType);
    expect(data3.headers['content-length']).toEqual(text.length.toString());
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual(text);
    expect(data.headers['content-type']).toEqual(contentType);
    expect(data.headers['content-length']).toEqual(text.length.toString());
  });

  test('It should test error handler', async () => {
    const text = 'error';

    app.then(async () => Promise.reject(new Error(text)));

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    });

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual(text);
    expect(data.headers['content-length']).toEqual(text.length.toString());
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual(text);
    expect(data.headers['content-length']).toEqual(text.length.toString());
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual(text);
    expect(data.headers['content-length']).toEqual(text.length.toString());

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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual('test');
    expect(data.headers['content-length']).toEqual('test'.length.toString());

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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual('test');
    expect(data.headers['content-length']).toEqual('test'.length.toString());

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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual('test');
    expect(data.headers['content-length']).toEqual('test'.length.toString());

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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.data).toEqual('test');
    expect(data.headers['content-length']).toEqual('test'.length.toString());

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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
    expect(data.headers['content-type']).toEqual(contentType);
    expect(data.data).toEqual(text);
    expect(data.headers['content-length']).toEqual(text.length.toString());
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
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

    const data = await axios.get(host);

    expect(data.status).toEqual(200);
    expect(data.statusText).toEqual('OK');
  });
});
