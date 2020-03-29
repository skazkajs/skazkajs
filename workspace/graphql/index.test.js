const srv = require('@skazka/server-http');

const { expect, axios, host } = require('../../test.config');

const app = require('.');

describe('GraphQL example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test GET request', async () => {
    await axios.get(`${host}/?query={hello}`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).equal('off');
      expect(response.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).equal('noopen');
      expect(response.headers['x-content-type-options']).equal('nosniff');
      expect(response.headers['x-xss-protection']).equal('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).equal('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).equal('application/json; charset=utf-8');
    });
  });

  it('It should test POST request', async () => {
    await axios.post(host, { query: '{ hello }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).equal('off');
      expect(response.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).equal('noopen');
      expect(response.headers['x-content-type-options']).equal('nosniff');
      expect(response.headers['x-xss-protection']).equal('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).equal('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).equal('application/json; charset=utf-8');
    });
  });
});
