/* eslint no-console: 0 */

const { expect, sinon } = require('../../../test.config');

const defaultErrorHandler = require('./defaultErrorHandler');

describe('Error default test', () => {
  it('It should test defaultErrorHandler', async () => {
    const error = { error: true };
    const payload = { payload: true };

    sinon.stub(console, 'error');

    await defaultErrorHandler(error);
    await defaultErrorHandler(error, payload);
    expect(console.error.args.length).to.be.equal(0);

    process.env.STAGE = 'production';
    await defaultErrorHandler(error);
    await defaultErrorHandler(error, payload);
    delete process.env.STAGE;

    expect(console.error.args[0][0]).to.be.equal(error);
    expect(console.error.args[0][1]).is.null();

    expect(console.error.args[1][0]).to.be.equal(error);
    expect(console.error.args[1][1]).to.be.equal(payload);

    console.error.restore();
  });
});
