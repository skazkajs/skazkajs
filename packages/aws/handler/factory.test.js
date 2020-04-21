const { expect, sinon } = require('../../../test.config');

const factory = require('./factory');

describe('Handler factory test', () => {
  it('It should test wrapper', async () => {
    const spy = sinon.spy();

    const res = 123;

    const wrapper = factory(async (handler, options, args) => handler(...args));

    const handler = wrapper(async (a, b, c) => {
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      expect(c).to.be.equal(3);

      spy();

      return res;
    });

    const response = await handler(1, 2, 3);

    expect(response).to.be.equal(res);
  });
});
