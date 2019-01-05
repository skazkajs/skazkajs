const App = require('@skazka/server'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const cors = require('.');

const { host, axios } = global;

describe('Server cors test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test cors for GET', async () => {
    app.then(cors());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end();
    });

    await axios.get(host, { headers: { Origin: 'skazkajs.rog' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual('');
      expect(response.headers['access-control-allow-origin']).toEqual('*');
    });
  });

  test('It should test cors for OPTIONS', async () => {
    app.then(cors());

    app.then(async (ctx) => {
      ctx.res.statusCode = 200;
      ctx.res.end();
    });

    await axios.options(host, { headers: { Origin: 'http://skazkajs.rog/' } }).then((response) => {
      expect(response.status).toEqual(204);
      expect(response.statusText).toEqual('No Content');
      expect(response.data).toEqual('');
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      expect(response.headers['access-control-allow-methods']).toEqual('GET,HEAD,PUT,PATCH,POST,DELETE');
      expect(response.headers.vary).toEqual('Access-Control-Request-Headers');
    });
  });
});
