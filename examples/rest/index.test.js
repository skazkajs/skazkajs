const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('.');

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('REST example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test redirect', async () => {
    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toContain('/users');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // redirect
      expect(response.headers.location).toEqual('/users');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test GET /users', async () => {
    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual([]);
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
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test POST /users', async () => {
    const user = { name: 'test' };
    await axios.post(`${host}/users`, user).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.message).toEqual('User saved');
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
      expect(response.headers['content-type']).toEqual('application/json');
    });

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data[0]).toEqual(user);
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
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });
});
