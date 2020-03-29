const App = require('@skazka/server'); //  eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const request = require('@skazka/server-request'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const bodyParser = require('.');

describe('Server bodyParser test', () => {
  let app;
  let server;

  afterEach((done) => {
    server.close(done);
  });

  it('It should test json', async () => {
    app = new App();
    app.then(response());
    app.then(request());
    app.then(bodyParser.json());

    app.then((ctx) => ctx.response(ctx.request.body.data));

    server = srv.createHttpServer(app);

    await axios.post(host, { data: 'test' }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test json in code', async () => {
    app = new App();
    app.then(request());
    app.then(response());

    app.then(async (ctx) => {
      await bodyParser.json(ctx);

      return ctx.response(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, { data: 'test' }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('test');
    });
  });

  it('It should test raw', async () => {
    app = new App();
    app.then(request());
    app.then(response());
    app.then(bodyParser.raw());

    app.then((ctx) => ctx.response(ctx.request.body.toString()));

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'application/octet-stream' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql({ data: 'test' });
    });
  });

  it('It should test raw in code', async () => {
    app = new App();
    app.then(request());
    app.then(response());

    app.then(async (ctx) => {
      await bodyParser.raw(ctx);

      return ctx.response(ctx.request.body.toString());
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'application/octet-stream' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql({ data: 'test' });
    });
  });

  it('It should test text', async () => {
    app = new App();
    app.then(request());
    app.then(response());
    app.then(bodyParser.text());

    app.then((ctx) => ctx.response(ctx.request.body));

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'text/plain' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql({ data: 'test' });
    });
  });

  it('It should test text in code', async () => {
    app = new App();
    app.then(request());
    app.then(response());

    app.then(async (ctx) => {
      await bodyParser.text(ctx);

      return ctx.response(ctx.request.body);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, {
      data: 'test',
    }, {
      headers: { 'Content-Type': 'text/plain' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql({ data: 'test' });
    });
  });

  it('It should test urlencoded', async () => {
    app = new App();
    app.then(request());
    app.then(response());
    app.then(bodyParser.urlencoded({ extended: true }));

    app.then((ctx) => ctx.response(ctx.request.body.data));

    server = srv.createHttpServer(app);

    await axios.post(host, 'data=test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql('test');
    });
  });

  it('It should test urlencoded in code', async () => {
    app = new App();
    app.then(request());
    app.then(response());

    app.then(async (ctx) => {
      await bodyParser.urlencoded(ctx, { extended: true });

      return ctx.response(ctx.request.body.data);
    });

    server = srv.createHttpServer(app);

    await axios.post(host, 'data=test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).eql('test');
    });
  });

  it('It should test without request', async () => {
    app = new App();
    app.then(response());
    app.then(bodyParser.json());

    app.then((ctx) => ctx.response(ctx.request));

    server = srv.createHttpServer(app);

    await axios.post(host, { data: 'test' }).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal('');
    });
  });
});
