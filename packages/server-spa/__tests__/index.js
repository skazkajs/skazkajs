const { resolve } = require('path');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const index = require('..');

const { host, axios } = global;

describe('Server spa test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test serving', async () => {
    app.then(index(resolve(__dirname, 'files', 'index.html')));

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Index</div>');
    });
  });

  test('It should test 500', async () => {
    app.then(index(resolve(__dirname, 'files', 'index.htm')));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data).toContain('');
    });
  });
});
