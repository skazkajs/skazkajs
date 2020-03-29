const App = require('@skazka/server'); // eslint-disable-line
const Router = require('@skazka/server-router'); // eslint-disable-line
const error = require('@skazka/server-error'); // eslint-disable-line
const response = require('@skazka/server-response'); //  eslint-disable-line
const srv = require('@skazka/server-http'); // eslint-disable-line

const { expect, axios, host } = require('../../../test.config');

const mysql = require('.');
const pool = require('./pool');

describe('Server mysql test', async () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      mysql(),
      response(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  after(async () => {
    await pool.end();
  });

  it('It should test middleware', async () => {
    app.then(async (ctx) => {
      const [rows] = await ctx.mysql.query('SELECT 1+1 AS res;');
      expect(rows[0].res).equal(2);

      return ctx.response(rows[0].res);
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal(2);
    });
  });

  it('It should test middleware with connection', async () => {
    app.then(async (ctx) => {
      const connection = await ctx.mysql.getConnection();

      const [rows] = await connection.query('SELECT 1+1 AS res;');

      await connection.release();

      expect(rows[0].res).equal(2);

      return ctx.response(rows[0].res);
    });

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal(2);
    });
  });

  it('It should test router', async () => {
    router.catch().then(async (ctx) => {
      const [rows] = await ctx.mysql.query('SELECT 1+1 AS res;');

      expect(rows[0].res).equal(2);

      return ctx.response(rows[0].res);
    });

    app.then(router.resolve());

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal(2);
    });
  });

  it('It should test router with connection', async () => {
    router.catch().then(async (ctx) => {
      const connection = await ctx.mysql.getConnection();

      const [rows] = await connection.query('SELECT 1+1 AS res;');

      await connection.release();

      expect(rows[0].res).equal(2);

      return ctx.response(rows[0].res);
    });

    app.then(router.resolve());

    await axios.get(host).then((res) => {
      expect(res.status).equal(200);
      expect(res.statusText).equal('OK');
      expect(res.data).equal(2);
    });
  });

  it('It should test pool', async () => {
    const [rows] = await pool.query('SELECT 1+1 AS res;');

    expect(rows[0].res).equal(2);
  });

  it('It should test pool with connection', async () => {
    const connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT 1+1 AS res;');

    await connection.release();

    expect(rows[0].res).equal(2);
  });

  it('It should test transaction', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query('SELECT 1+1 AS res;');
      await connection.commit();
      isTestFinished1 = true;
    } catch (e) {
      await connection.rollback();
      isTestFinished2 = true;
    } finally {
      await connection.release();
    }

    expect(isTestFinished1).is.true();
    expect(isTestFinished2).is.false();
  });

  it('It should test transaction with error', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      await connection.query('delete from users;');
      await connection.commit();
      isTestFinished1 = true;
    } catch (e) {
      await connection.rollback();
      isTestFinished2 = true;
    } finally {
      await connection.release();
    }

    expect(isTestFinished1).is.false();
    expect(isTestFinished2).is.true();
  });
});
