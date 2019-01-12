const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('.');

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('SPA example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test serving', async () => {
    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Test page</div>');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      expect(response.headers['surrogate-control']).toEqual('no-store');
      expect(response.headers['cache-control']).toEqual('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers.pragma).toEqual('no-cache');
      expect(response.headers.expires).toEqual('0');
      expect(response.headers['content-type']).toEqual('text/html;charset=UTF-8');
    });
  });

  test('It should test serving js', async () => {
    await axios.get(`${host}/js/scripts.js`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('console.log');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      expect(response.headers.etag).toEqual('/js/scripts.js');
      expect(response.headers['content-type']).toEqual('application/javascript; charset=utf-8');
    });
  });
});
