const { resolve } = require('path');

const App = require('@skazka/server'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const {
  expect,
  sinon,
  axios,
  host,
} = require('../../../test.config');

const spa = require('.');

describe('Server spa test', async () => {
  let app;
  let server;

  const root = resolve(__dirname, 'files');
  const index = 'index.html';

  beforeEach(() => {
    app = new App();
    app.then(error());
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('It should test serving', async () => {
    app.then(spa({ root }));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test serving with index', async () => {
    app.then(spa({ root, index }));

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });
  });

  it('It should test 404', async () => {
    app.then(spa({ root, index: 'index.htm' }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(404);
      expect(response.statusText).equal('Not Found');
      expect(response.data).contain('');
    });
  });

  it('It should test module after spa', async () => {
    const mock = sinon.spy();

    app.then(spa({ root, index }));

    app.then(() => {
      mock();
    });

    await axios.get(host).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('<div>Index</div>');
    });

    expect(mock.called).is.false();
  });

  it('It should test empty root', async () => {
    app.then(spa());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data).contain('The "root" parameter is required!');
    });
  });
});
