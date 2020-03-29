const srv = require('@skazka/server-http');

const { expect, axios, host } = require('../../test.config');

const app = require('.');

describe('SPA example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test serving', async () => {
    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Test page</div>');
      expect(response.headers['x-dns-prefetch-control']).equal('off');
      expect(response.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).equal('noopen');
      expect(response.headers['x-content-type-options']).equal('nosniff');
      expect(response.headers['x-xss-protection']).equal('1; mode=block');
      expect(response.headers['surrogate-control']).equal('no-store');
      expect(response.headers['cache-control']).equal('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers.pragma).equal('no-cache');
      expect(response.headers.expires).equal('0');
      expect(response.headers['content-type']).equal('text/html;charset=UTF-8');
    });
  });

  it('It should test serving js', async () => {
    await axios.get(`${host}/js/scripts.js`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('console.log');
      expect(response.headers['x-dns-prefetch-control']).equal('off');
      expect(response.headers['x-frame-options']).equal('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).equal('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).equal('noopen');
      expect(response.headers['x-content-type-options']).equal('nosniff');
      expect(response.headers['x-xss-protection']).equal('1; mode=block');
      expect(response.headers.etag).equal('/js/scripts.js');
      expect(response.headers['content-type']).equal('application/javascript; charset=utf-8');
    });
  });
});
