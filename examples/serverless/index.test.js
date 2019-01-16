const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('./app');

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

  test('It should test GET graphql request', async () => {
    await axios.get(`${host}/?query={ users { name } }`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users).toEqual([]);
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

  test('It should test POST graphql request', async () => {
    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users).toEqual([]);
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
    await axios.post(`${host}/users`, { name: 'test' }).then((response) => {
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
      expect(response.data[0].name).toEqual('test');
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

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
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

  test('It should test POST graphql request to add data', async () => {
    await axios.post(`${host}/`, {
      query: `
      mutation getUsers {
        users(name: "test") {
          name
        }
       }
       `,
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
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

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
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

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data[0].name).toEqual('test');
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
