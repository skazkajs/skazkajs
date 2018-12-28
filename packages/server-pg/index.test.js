const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const pg = require('.');
const pool = require('./pool');

const { host, axios } = global;

describe('Server pg test', async () => {
  let app;
  let router;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
      pg(),
    ]);
    router = new Router();
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  afterAll(() => {
    pool.end();
  });

  test('It should test middleware', async () => {
    app.then(async (ctx) => {
      const result = await ctx.pg.query('SELECT 1+1 AS res;');
      expect(result.rows[0].res).toEqual(2);

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual(2);
    });
  });

  test('It should test middleware with connection', async () => {
    app.then(async (ctx) => {
      const connection = await ctx.pg.connect();

      const result = await connection.query('SELECT 1+1 AS res;');

      connection.release();

      expect(result.rows[0].res).toEqual(2);

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual(2);
    });
  });

  test('It should test router', async () => {
    router.catch().then(async (ctx) => {
      const result = await ctx.pg.query('SELECT 1+1 AS res;');

      expect(result.rows[0].res).toEqual(2);

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    app.then(router.resolve());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual(2);
    });
  });

  test('It should test router with connection', async () => {
    router.catch().then(async (ctx) => {
      const connection = await ctx.pg.connect();

      const result = await connection.query('SELECT 1+1 AS res;');

      connection.release();

      expect(result.rows[0].res).toEqual(2);

      ctx.res.writeHead(200);
      ctx.res.end(JSON.stringify(result.rows[0].res));
    });

    app.then(router.resolve());

    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual(2);
    });
  });

  test('It should test pool', async () => {
    const result = await pool.query('SELECT 1+1 AS res;');

    expect(result.rows[0].res).toEqual(2);
  });

  test('It should test pool with connection', async () => {
    const connection = await pool.connect();

    const result = await connection.query('SELECT 1+1 AS res;');

    connection.release();

    expect(result.rows[0].res).toEqual(2);
  });

  test('It should test transaction', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const connection = await pool.connect();

    try {
      await connection.query('BEGIN');
      await connection.query('SELECT 1+1 AS res;');
      await connection.query('COMMIT');
      isTestFinished1 = true;
    } catch (e) {
      await connection.query('ROLLBACK');
      isTestFinished2 = true;
    } finally {
      connection.release();
    }

    expect(isTestFinished1).toBe(true);
    expect(isTestFinished2).not.toBe(true);
  });

  test('It should test transaction with error', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const connection = await pool.connect();

    try {
      await connection.query('BEGIN');
      await connection.query('DELETE FROM users;');
      await connection.query('COMMIT');
      isTestFinished1 = true;
    } catch (e) {
      await connection.query('ROLLBACK');
      isTestFinished2 = true;
    } finally {
      connection.release();
    }

    expect(isTestFinished1).not.toBe(true);
    expect(isTestFinished2).toBe(true);
  });
});
