const { resolve } = require('path');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const spa = require('..');

const { host, axios } = global;

describe('Server spa test', async () => {
  let app;
  let server;

  const root = resolve(__dirname, 'files');
  const index = 'index.html';

  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test serving', async () => {
    app.then(spa({ root }));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });
  });

  test('It should test serving with index', async () => {
    app.then(spa({ root, index }));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });
  });

  test('It should test 404', async () => {
    app.then(spa({ root, index: 'index.htm' }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(404);
      expect(response.statusText).toEqual('Not Found');
      expect(response.data).toContain('');
    });
  });

  test('It should test module after spa', async () => {
    const mock = jest.fn();

    app.then(spa({ root, index }));

    app.then(() => {
      mock();
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });

    expect(mock).not.toHaveBeenCalled();
  });

  test('It should test empty root', async () => {
    app.then(spa());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toContain('The "root" parameter is required!');
    });
  });
});
