const App = require('@skazka/server'); //  eslint-disable-line
const Context = require('@skazka/server-context'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const responseModule = require('.');
const Response = require('./response');

describe('Server response test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();

    app.all([
      error(),
      responseModule(),
    ]);

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test response', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response('test');
    });

    app.then(async (ctx) => {
      mockThen2();

      ctx.res.end('test2');

      return Promise.reject();
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('test');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.false();
  });

  it('It should test response with status code', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response('test', 202);
    });

    app.then(async (ctx) => {
      mockThen2();

      ctx.res.end('test2');

      return Promise.reject();
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(202);
      expect(response.statusText).equal('Accepted');
      expect(response.data).equal('test');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.false();
  });

  it('It should test response with error status code', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response('test', 404);
    });

    app.then(async (ctx) => {
      mockThen2();

      ctx.res.end('test2');

      return Promise.reject();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).equal('test');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.false();
  });

  it('It should test sent response', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      ctx.res.end('sent');
    });

    app.then(async (ctx) => {
      mockThen2();

      return ctx.response('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('sent');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.true();
  });

  it('It should test response with promise', async () => {
    const mockThen = sinon.spy();

    app.then(async (ctx) => {
      mockThen();

      const data = Promise.resolve('test');

      return ctx.response(data);
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('test');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test response with stringify', async () => {
    const mockThen = sinon.spy();

    app.then(async (ctx) => {
      mockThen();

      return ctx.response({ message: 'Ok' });
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).eql({ message: 'Ok' });
    });

    expect(mockThen.called).is.true();
  });

  it('It should test redirect with default parameters', async () => {
    const mockThen = sinon.spy();

    app.then(async (ctx) => {
      mockThen();

      return ctx.redirect();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(301);
      expect(response.statusText).equal('Moved Permanently');
      expect(response.data).equal('/');
      expect(response.headers.location).equal('/');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test redirect with parameters', async () => {
    const mockThen = sinon.spy();

    app.then(async (ctx) => {
      mockThen();

      return ctx.redirect('/test', 302);
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(302);
      expect(response.statusText).equal('Found');
      expect(response.data).equal('/test');
      expect(response.headers.location).equal('/test');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test error resolve', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();
    const mockThen3 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      const err = Promise.reject(new Error());

      return ctx.response(err);
    }).then(async () => {
      mockThen2();
    }).catch(async () => {
      mockThen3();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data).equal('Internal Server Error');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.false();
    expect(mockThen3.called).is.true();
  });

  it('It should test error resolve with error', async () => {
    const mockThen1 = sinon.spy();
    const mockThen2 = sinon.spy();
    const mockThen3 = sinon.spy();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response(new Error());
    }).then(async () => {
      mockThen2();
    }).catch(async () => {
      mockThen3();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data).equal('Internal Server Error');
    });

    expect(mockThen1.called).is.true();
    expect(mockThen2.called).is.false();
    expect(mockThen3.called).is.false();
  });

  it('It should test send', async () => {
    app.then((ctx) => (new Response(ctx)).send('data'));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('data');
      expect(response.headers['content-type']).equal('text/plain');
    });
  });

  it('It should test sendJSON', async () => {
    app.then((ctx) => (new Response(ctx)).sendJSON('data'));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('data');
      expect(response.headers['content-type']).equal('application/json');
    });
  });

  it('It should test redirect', async () => {
    app.then((ctx) => (new Response(ctx)).redirect('/test'));

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(301);
      expect(response.statusText).equal('Moved Permanently');
      expect(response.data).equal('/test');
      expect(response.headers.location).equal('/test');
    });
  });

  it('It should test setHeader', async () => {
    app.then(async (ctx) => {
      const response = new Response(ctx);

      response.setHeader('Test', 'Test');

      return response.send('data');
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('data');
      expect(response.headers.test).equal('Test');
    });
  });

  it('It should test json', async () => {
    app.then((ctx) => ctx.json('data'));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('data');
      expect(response.headers['content-type']).equal('application/json');
    });
  });

  it('It should test response without context', async () => {
    app.then(async () => {
      const response = new Response(new Context());

      response.setHeader('Test', 'Test');

      return response.send('data');
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data).equal('Response should be set!');
    });
  });

  it('It should test send without data', async () => {
    app.then((ctx) => (new Response(ctx)).send());

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('');
      expect(response.headers['content-type']).equal('text/plain');
    });
  });

  it('It should test sendJSON without data', async () => {
    app.then((ctx) => (new Response(ctx)).sendJSON());

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).equal('');
      expect(response.headers['content-type']).equal('application/json');
    });
  });
});
