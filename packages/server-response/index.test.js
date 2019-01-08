const App = require('@skazka/server'); //  eslint-disable-line
const Context = require('@skazka/server-context'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const responseModule = require('.');
const Response = require('./response');

const { host, axios } = global;

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

  test('It should test response', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();

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
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).not.toHaveBeenCalled();
  });

  test('It should test response with status code', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();

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
      expect(response.status).toEqual(202);
      expect(response.statusText).toEqual('Accepted');
      expect(response.data).toEqual('test');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).not.toHaveBeenCalled();
  });

  test('It should test response with error status code', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();

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
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toEqual('test');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).not.toHaveBeenCalled();
  });

  test('It should test sent response', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();

    app.then(async (ctx) => {
      mockThen1();

      ctx.res.end('sent');
    });

    app.then(async (ctx) => {
      mockThen2();

      return ctx.response('test');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('sent');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).toHaveBeenCalled();
  });

  test('It should test response with promise', async () => {
    const mockThen = jest.fn();

    app.then(async (ctx) => {
      mockThen();

      const data = Promise.resolve('test');

      return ctx.response(data);
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('test');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test response with stringify', async () => {
    const mockThen = jest.fn();

    app.then(async (ctx) => {
      mockThen();

      return ctx.response({ message: 'Ok' });
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual({ message: 'Ok' });
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test redirect with default parameters', async () => {
    const mockThen = jest.fn();

    app.then(async (ctx) => {
      mockThen();

      return ctx.redirect();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toEqual('/');
      expect(response.headers.location).toEqual('/');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test redirect with parameters', async () => {
    const mockThen = jest.fn();

    app.then(async (ctx) => {
      mockThen();

      return ctx.redirect('/test', 302);
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(302);
      expect(response.statusText).toEqual('Found');
      expect(response.data).toEqual('/test');
      expect(response.headers.location).toEqual('/test');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test error resolve', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();
    const mockThen3 = jest.fn();

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
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('Internal Server Error');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).not.toHaveBeenCalled();
    expect(mockThen3).toHaveBeenCalled();
  });

  test('It should test error resolve with error', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();
    const mockThen3 = jest.fn();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response(new Error());
    }).then(async () => {
      mockThen2();
    }).catch(async () => {
      mockThen3();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('Internal Server Error');
    });

    expect(mockThen1).toHaveBeenCalled();
    expect(mockThen2).not.toHaveBeenCalled();
    expect(mockThen3).not.toHaveBeenCalled();
  });

  test('It should test send', async () => {
    app.then(ctx => (new Response(ctx)).send('data'));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('data');
      expect(response.headers['content-type']).toEqual('text/plain');
    });
  });

  test('It should test sendJSON', async () => {
    app.then(ctx => (new Response(ctx)).sendJSON('data'));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('data');
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test redirect', async () => {
    app.then(ctx => (new Response(ctx)).redirect('/test'));

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toEqual('/test');
      expect(response.headers.location).toEqual('/test');
    });
  });

  test('It should test setHeader', async () => {
    app.then(async (ctx) => {
      const response = new Response(ctx);

      response.setHeader('Test', 'Test');

      return response.send('data');
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('data');
      expect(response.headers.test).toEqual('Test');
    });
  });

  test('It should test json', async () => {
    app.then(ctx => ctx.json('data'));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('data');
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test response without context', async () => {
    app.then(async () => {
      const response = new Response(new Context());

      response.setHeader('Test', 'Test');

      return response.send('data');
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toEqual('Response should be set!');
    });
  });

  test('It should test send without data', async () => {
    app.then(ctx => (new Response(ctx)).send());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['content-type']).toEqual('text/plain');
    });
  });

  test('It should test sendJSON without data', async () => {
    app.then(ctx => (new Response(ctx)).sendJSON());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });
});
