/* eslint no-console: 0 */

const { expect, sinon } = require('../../../test.config');

const smoke = require('./smoke');

describe('Handler smoke test', () => {
  it('It should test RESPONSE', async () => {
    expect(smoke.RESPONSE).to.be.eql({ status: 'success' });
  });

  it('It should test SMOKE_EVENT', async () => {
    expect(smoke.SMOKE_EVENT).to.be.eql({ isSmoke: true });
  });

  it('It should test defaultSmokeHandler', async () => {
    const event = { event: true };
    const context = { context: true };

    sinon.stub(console, 'log');

    expect(
      await smoke.defaultSmokeHandler(event, context),
    ).to.be.equal(smoke.RESPONSE);
    expect(console.log.args.length).to.be.equal(0);

    process.env.STAGE = 'production';
    expect(
      await smoke.defaultSmokeHandler(event, context),
    ).to.be.equal(smoke.RESPONSE);
    delete process.env.STAGE;

    expect(console.log.args[0][0]).to.be.equal(event);
    expect(console.log.args[0][1]).to.be.equal(context);

    console.log.restore();
  });

  it('It should test isSmokeEvent', async () => {
    expect(smoke.isSmokeEvent(smoke.SMOKE_EVENT)).is.true();
    expect(smoke.isSmokeEvent({ isSmoke: true })).is.true();
  });
});
