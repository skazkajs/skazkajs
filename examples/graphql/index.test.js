const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('.');

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('GraphQL example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test GET request', async () => {
    await axios.get(`${host}/?query={hello}`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });
  });

  test('It should test POST request', async () => {
    await axios.post(host, { query: '{ hello }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });
  });
});
