const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const cors = require('.');

const { host, axios } = global;

describe('Server cors test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(response());

    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test cors for GET', async () => {
    app.then(cors());

    app.then(ctx => ctx.response());

    await axios.get(host, { headers: { Origin: 'skazkajs.rog' } }).then((res) => {
      expect(res.status).toEqual(200);
      expect(res.statusText).toEqual('OK');
      expect(res.data).toEqual('');
      expect(res.headers['access-control-allow-origin']).toEqual('*');
    });
  });

  test('It should test cors for OPTIONS', async () => {
    app.then(cors());

    app.then(ctx => ctx.response());

    await axios.options(host, { headers: { Origin: 'http://skazkajs.rog/' } }).then((res) => {
      expect(res.status).toEqual(204);
      expect(res.statusText).toEqual('No Content');
      expect(res.data).toEqual('');
      expect(res.headers['access-control-allow-origin']).toEqual('*');
      expect(res.headers['access-control-allow-methods']).toEqual('GET,HEAD,PUT,PATCH,POST,DELETE');
      expect(res.headers.vary).toEqual('Access-Control-Request-Headers');
    });
  });
});
