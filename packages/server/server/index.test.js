const http = require('http');
const pause = require('promise-pause-timeout'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const App = require('.');

const port = parseInt(process.env.PORT || '3000', 10);

describe('Server test', () => {
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

  it('It should test promise', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      expect(ctx.get('server')).equal(app);

      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', contentType);
      ctx.res.end(text);
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal(text);
    expect(data.headers['content-type']).equal(contentType);
    expect(data.headers['content-length']).equal(text.length.toString());
  });

  it('It should test 3 calls', async () => {
    const text = 'okay';
    const contentType = 'text/plain';

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.setHeader('Content-Type', contentType);
      ctx.res.end(text);
    });

    const data1 = await axios.get(host);

    expect(data1.status).equal(200);
    expect(data1.statusText).equal('OK');
    expect(data1.data).equal(text);
    expect(data1.headers['content-type']).equal(contentType);
    expect(data1.headers['content-length']).equal(text.length.toString());

    const data2 = await axios.get(host);

    expect(data2.status).equal(200);
    expect(data2.statusText).equal('OK');
    expect(data2.data).equal(text);
    expect(data2.headers['content-type']).equal(contentType);
    expect(data2.headers['content-length']).equal(text.length.toString());

    const data3 = await axios.get(host);

    expect(data3.status).equal(200);
    expect(data3.statusText).equal('OK');
    expect(data3.data).equal(text);
    expect(data3.headers['content-type']).equal(contentType);
    expect(data3.headers['content-length']).equal(text.length.toString());
  });

  it('It should test chain of promises', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal(text);
    expect(data.headers['content-type']).equal(contentType);
    expect(data.headers['content-length']).equal(text.length.toString());
  });

  it('It should test error handler', async () => {
    const text = 'error';

    app.then(async () => Promise.reject(new Error(text)));

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal(text);
    expect(data.headers['content-length']).equal(text.length.toString());
  });

  it('It should test error handler without Promise.reject()', async () => {
    const text = 'error';

    app.then(async () => {
      throw new Error(text);
    });

    app.catch(async (err, ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end(err.message);
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal(text);
    expect(data.headers['content-length']).equal(text.length.toString());
  });

  it('It should test 2 error handlers', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal(text);
    expect(data.headers['content-length']).equal(text.length.toString());

    expect(isTestFinished1).is.true();
    expect(isTestFinished2).is.true();
  });

  it('It should test breaking of promises chain without catch', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal('test');
    expect(data.headers['content-length']).equal('test'.length.toString());

    expect(isTestOk).is.true();
  });

  it('It should test breaking of promises chain without catch with promise', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal('test');
    expect(data.headers['content-length']).equal('test'.length.toString());

    expect(isTestOk).is.true();
  });

  it('It should test breaking of promises chain with catch', async () => {
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
      expect(err.message).equal('test');
      isTestOk = true;
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal('test');
    expect(data.headers['content-length']).equal('test'.length.toString());

    expect(isTestOk).is.true();
  });

  it('It should test breaking of promises chain with catch with promise', async () => {
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
      expect(err.message).equal('test');
      isTestOk = true;
    });

    const data = await axios.get(host);

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.data).equal('test');
    expect(data.headers['content-length']).equal('test'.length.toString());

    expect(isTestOk).is.true();
  });

  it('It should test all', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
    expect(data.headers['content-type']).equal(contentType);
    expect(data.data).equal(text);
    expect(data.headers['content-length']).equal(text.length.toString());
  });

  it('It should test race', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });

  it('It should test race without reject', async () => {
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

    expect(data.status).equal(200);
    expect(data.statusText).equal('OK');
  });
});
