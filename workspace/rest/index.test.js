const srv = require('@skazka/server-http');

const { expect, axios, host } = require('../../test.config');

const app = require('.');

describe('REST example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test redirect', async () => {
    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).equal(301);
      expect(response.statusText).equal('Moved Permanently');
      expect(response.data).contain('/users');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).equal('off');
      expect(response.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).equal('noopen');
      expect(response.headers['x-content-type-options']).equal('nosniff');
      expect(response.headers['x-xss-protection']).equal('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).equal('*');
      // redirect
      expect(response.headers.location).equal('/users');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).equal('application/json');
    });
  });

  it('It should test GET /users', async () => {
    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).eql([]);
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
      expect(response.headers['content-type']).equal('application/json');
    });
  });

  it('It should test POST /users', async () => {
    const user = { name: 'test' };
    await axios.post(`${host}/users`, user).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.message).equal('User saved');
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
      expect(response.headers['content-type']).equal('application/json');
    });

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data[0]).eql(user);
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
      expect(response.headers['content-type']).equal('application/json');
    });
  });
});
