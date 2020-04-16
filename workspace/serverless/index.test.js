/* eslint no-console: 0 */

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../test.config');

const app = require('.');

describe('GraphQL example test', async () => {
  let server;

  beforeEach(() => {
    server = app.handler();
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test GET graphql request', async () => {
    await axios.get(`${host}/?query={ users { name } }`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.users).eql([]);
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

  it('It should test POST graphql request', async () => {
    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.users).eql([]);
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
    await axios.post(`${host}/users`, { name: 'test' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).eql([{ name: 'test' }]);
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
      expect(response.data[0].name).equal('test');
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

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.users[0].name).equal('test');
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

  it('It should test POST graphql request to add data', async () => {
    await axios.post(`${host}/`, {
      query: `
      mutation getUsers {
        users(name: "test") {
          name
        }
       }
       `,
    }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.users[0].name).equal('test');
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

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.users[0].name).equal('test');
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

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data[0].name).equal('test');
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

  it('It should test POST /users with error', async () => {
    const spy = sinon.spy();

    sinon.stub(console, 'error');

    try {
      await axios.post(`${host}/users`);
    } catch (error) {
      expect(error.message).to.be.eql('Request failed with status code 500');

      spy();
    }

    expect(spy.called).is.true();

    expect(console.error.args[0][0].message).to.be.eql('Empty user!');

    console.error.restore();
  });
});
