const { expect, sinon } = require('../../../test.config');

const container = require('./container');

const compose = require('../handler/compose');

describe('Container test', () => {
  it('It should test container', async () => {
    const spy = sinon.spy();

    const handler = container(
      async () => {
        spy();
      },
    );

    await handler();

    expect(spy.called).is.true();
  });

  it('It should test container with error', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = container(
      async () => {
        spy1();

        throw error;
      },
      {
        errorHandler: async (err) => {
          expect(err).to.be.equal(error);
          spy2();
        },
      },
    );

    try {
      await handler();
    } catch (e) {
      spy3();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.false();
  });

  it('It should test container with useRegistry', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const handler = container(
      async (registry) => {
        expect(registry.isTest).is.true();
        spy1();
      },
      {
        useRegistry: async (registry) => {
          registry.isTest = true; //eslint-disable-line
          spy2();

          return async () => {
            delete registry.isTest; //eslint-disable-line
            spy3();
          };
        },
      },
    );

    await handler();

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
  });

  it('It should test container with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      container(),
    );

    const handler = wrapper(() => {
      spy();
    });

    await handler();

    expect(spy.called).is.true();
  });
});
