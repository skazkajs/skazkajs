const { expect } = require('../../../test.config');

const createPool = require('./pool');

describe('Mysql pool test', () => {
  it('It should test main flow', async () => {
    const options = {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'skazka',
      connectionLimit: 5,
    };

    const pool = createPool(options);

    const [rows] = await pool.query('SELECT 1+1 AS res;');

    expect(rows[0].res).equal(2);

    pool.end();
  });

  it('It should test main with await flow', async () => {
    const options = {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'skazka',
      connectionLimit: 5,
    };

    const pool = await createPool(options);

    const [rows] = await pool.query('SELECT 1+1 AS res;');

    expect(rows[0].res).equal(2);

    await pool.end();
  });
});
