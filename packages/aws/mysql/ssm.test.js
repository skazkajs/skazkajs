const { expect } = require('../../../test.config');

const actions = require('../ssm/actions');

const createPoolSSM = require('./ssm');

describe('Mysql SSM pool test', () => {
  it('It should test main flow', async () => {
    const host = 'mysqlHost';
    const port = 'mysqlPort';
    const user = 'mysqlUser';
    const password = 'mysqlPassword';

    const names = [host, port, user, password];

    await actions.putParameter(host, '127.0.0.1');
    await actions.putParameter(port, '3306');
    await actions.putParameter(user, 'root');
    await actions.putParameter(password, 'root');

    const options = {
      host,
      port,
      user,
      password,
      database: 'skazka',
      connectionLimit: 5,
    };

    const pool = await createPoolSSM(options, names);

    const [rows] = await pool.query('SELECT 1+1 AS res;');

    expect(rows[0].res).equal(2);

    await pool.end();

    await actions.deleteParameters(names);
  });
});
