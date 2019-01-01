const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const responseModule = require('.');

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

      return ctx.response.resolve('test');
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

      return ctx.response.resolve('test', 202);
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

      return ctx.response.resolve('test', 404);
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

      return ctx.response.resolve('test');
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

      return ctx.response.resolve(data);
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

      return ctx.response.resolve({ message: 'Ok' });
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

      return ctx.response.redirect();
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toEqual('');
      expect(response.headers.location).toEqual('/');
    });

    expect(mockThen).toHaveBeenCalled();
  });

  test('It should test redirect with parameters', async () => {
    const mockThen = jest.fn();

    app.then(async (ctx) => {
      mockThen();

      return ctx.response.redirect('/test', 302);
    });

    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(302);
      expect(response.statusText).toEqual('Found');
      expect(response.data).toEqual('');
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

      return ctx.response.resolve(err);
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

      return ctx.response.resolve(new Error());
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

  test('It should test error reject', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();
    const mockThen3 = jest.fn();

    app.then(async (ctx) => {
      mockThen1();

      const err = Promise.reject(new Error());

      return ctx.response.reject(err);
    });
    app.then(async () => {
      mockThen2();
    });
    app.catch(async () => {
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

  test('It should test error reject with error', async () => {
    const mockThen1 = jest.fn();
    const mockThen2 = jest.fn();
    const mockThen3 = jest.fn();

    app.then(async (ctx) => {
      mockThen1();

      return ctx.response.reject(new Error());
    });
    app.then(async () => {
      mockThen2();
    });
    app.catch(async () => {
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
});
