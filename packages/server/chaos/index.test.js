const config = require('config');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const chaos = require('.');

describe('Server chaos test', () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test disabled', async () => {
    config.chaos.enabled = false;

    app.then(chaos());
    app.then(async (ctx) => {
      ctx.get('res').end();
    });

    await axios.get(host).then((data) => {
      expect(data.status).equal(200);
      expect(data.statusText).equal('OK');
    });
  });

  it('It should test enable with error', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 0;
    config.chaos.error.probability = 1;

    app.then(chaos());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.headers['x-chaos']).equal('1');
      expect(response.headers['x-chaos-error']).equal('1');
      expect(response.data).equal('Chaos');
    });
  });

  it('It should test enable with error and response', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 0;
    config.chaos.error.probability = 1;

    const mockThen = sinon.spy();
    const mockCatch = sinon.spy();

    app.then(chaos());
    app.then(async () => {
      mockThen();
    });
    app.catch(async () => {
      mockCatch();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.headers['x-chaos']).equal('1');
      expect(response.headers['x-chaos-error']).equal('1');
      expect(response.data).equal('Chaos');
    });

    expect(mockThen.called).is.false();
    expect(mockCatch.called).is.false();
  });

  it('It should test enable with timeout', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 1;
    config.chaos.timeout.time = 1;
    config.chaos.error.probability = 0;

    const mockThen = sinon.spy();

    app.then(chaos());
    app.then(async (ctx) => {
      mockThen();
      ctx.get('res').end();
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.headers['x-chaos']).equal('1');
      expect(response.headers['x-chaos-timeout']).equal('1');
      expect(response.data).equal('');
    });

    expect(mockThen.called).is.true();
  });

  it('It should test enable all', async () => {
    config.chaos.enabled = true;
    config.chaos.timeout.probability = 1;
    config.chaos.timeout.time = 1;
    config.chaos.error.probability = 1;

    const mockThen = sinon.spy();

    app.then(chaos());
    app.then(async (ctx) => {
      mockThen();
      ctx.get('res').end();
    });

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.headers['x-chaos']).equal('1');
      expect(response.headers['x-chaos-error']).equal('1');
      expect(response.data).equal('Chaos');
    });

    expect(mockThen.called).is.false();
  });
});
