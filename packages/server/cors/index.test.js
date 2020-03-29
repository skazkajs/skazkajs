const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const cors = require('.');

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

  it('It should test cors for GET', async () => {
    app.then(cors());

    app.then((ctx) => ctx.response());

    await axios.get(host, { headers: { Origin: 'skazkajs.rog' } }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
      expect(res.headers['access-control-allow-origin']).equal('*');
    });
  });

  it('It should test cors for OPTIONS', async () => {
    app.then(cors());

    app.then((ctx) => ctx.response());

    await axios.options(host, { headers: { Origin: 'http://skazkajs.rog/' } }).then((res) => {
      expect(res.status).equal(204);
      expect(res.statusText).equal('No Content');
      expect(res.data).equal('');
      expect(res.headers['access-control-allow-origin']).equal('*');
      expect(res.headers['access-control-allow-methods']).equal('GET,HEAD,PUT,PATCH,POST,DELETE');
      expect(res.headers.vary).equal('Access-Control-Request-Headers');
    });
  });
});
