const { expect, sinon } = require('../../../test.config');

const compose = require('./compose');
const factory = require('./factory');

const timeout = require('./timeout');
const retry = require('./retry');

describe('Handler factory test', () => {
  it('It should test compose', async () => {
    const spy = sinon.spy();

    const res = 123;

    const options1 = { options1: true };
    const options2 = { options2: true };
    const options3 = { options3: true };

    const wrapper1 = factory(async (handler, options, args) => handler(options, ...args));
    const wrapper2 = factory(async (handler, options, args) => handler(options, ...args));
    const wrapper3 = factory(async (handler, options, args) => handler(options, ...args));

    const wrapper = compose(
      wrapper1(null, options1),
      wrapper2(null, options2),
      wrapper3(null, options3),
    );

    const handler = wrapper(async (...args) => {
      expect(args[0]).to.be.equal(options3);
      expect(args[1]).to.be.equal(options2);
      expect(args[2]).to.be.equal(options1);
      expect(args[3]).to.be.equal(1);
      expect(args[4]).to.be.equal(2);
      expect(args[5]).to.be.equal(3);

      spy();

      return res;
    });

    const response = await handler(1, 2, 3);

    expect(response).to.be.equal(res);
  });

  it('It should test timeout and retry with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      timeout(null, { seconds: 1 }),
      retry(null, { count: 1 }),
    );

    const handler = wrapper((param) => {
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });
});
