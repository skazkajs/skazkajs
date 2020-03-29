const { expect, sinon } = require('../../../test.config');

const core = require('.');

describe('Server core test', async () => {
  it('It should work with one fn', async () => {
    const mock = sinon.spy();

    const context = {};

    const modules = [
      async (ctx) => {
        mock(ctx);
      },
    ];

    await core(context, modules);

    expect(mock.calledWith(context)).is.true();
  });
  it('It should work with 3 fns', async () => {
    const mock = sinon.spy();

    const context = {};

    const modules = [
      async (ctx) => {
        mock(ctx);
      },
      async (ctx) => {
        mock(ctx);
      },
      async (ctx) => {
        mock(ctx);
      },
    ];

    await core(context, modules);

    expect(mock.calledWith(context)).is.true();
    expect(mock.callCount).equal(3);
  });
  it('It should work with error', async () => {
    const mock = sinon.spy();

    const context = {};

    const error = new Error();

    const modules = [
      async (ctx) => {
        mock(ctx);
        throw error;
      },
      async (ctx) => {
        mock(ctx);
      },
    ];

    try {
      await core(context, modules);
    } catch (e) {
      expect(e).equal(error);
    }

    expect(mock.calledWith(context)).is.true();
    expect(mock.callCount).equal(1);
  });
});
