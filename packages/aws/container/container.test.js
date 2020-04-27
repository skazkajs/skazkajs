/* eslint no-console: 0 */

const { expect, sinon } = require('../../../test.config');

const container = require('./container');

const compose = require('../handler/compose');

describe('Container test', () => {
  it('It should test container', async () => {
    const spy = sinon.spy();

    sinon.stub(process, 'exit');

    const handler = container(
      async () => {
        spy();
      },
    );

    await handler();

    expect(spy.called).is.true();

    expect(process.exit.args[0][0]).to.be.equal(0);

    process.exit.restore();
  });

  it('It should test container with null as options', async () => {
    const spy = sinon.spy();

    sinon.stub(process, 'exit');

    const handler = container(
      async () => {
        spy();
      },
      null,
    );

    await handler();

    expect(spy.called).is.true();

    expect(process.exit.args[0][0]).to.be.equal(0);

    process.exit.restore();
  });

  it('It should test container with error', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    sinon.stub(process, 'exit');

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

    expect(process.exit.args[0][0]).to.be.equal(1);

    process.exit.restore();
  });

  it('It should test container with useRegistry', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    sinon.stub(process, 'exit');

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

    expect(process.exit.args[0][0]).to.be.equal(0);

    process.exit.restore();
  });

  it('It should test container with compose', async () => {
    const spy = sinon.spy();

    sinon.stub(process, 'exit');

    const wrapper = compose(
      container(),
    );

    const handler = wrapper(() => {
      spy();
    });

    await handler();

    expect(spy.called).is.true();

    expect(process.exit.args[0][0]).to.be.equal(0);

    process.exit.restore();
  });

  it('It should test container with error in useRegistry', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    sinon.stub(process, 'exit');

    const error = new Error('test');

    const handler = container(
      async () => {
        spy1();
      },
      {
        errorHandler: async (err) => {
          expect(err).to.be.equal(error);
          spy2();
        },
        useRegistry: async (registry) => {
          registry.isTest = true; //eslint-disable-line
          spy2();

          throw error;
        },
      },
    );

    try {
      await handler();
    } catch (e) {
      spy3();
    }

    expect(spy1.called).is.false();
    expect(spy2.called).is.true();
    expect(spy3.called).is.false();

    expect(process.exit.args[0][0]).to.be.equal(1);

    process.exit.restore();
  });

  it('It should test container with error in clear registry', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const spy4 = sinon.spy();

    sinon.stub(process, 'exit');

    const error = new Error('test');

    const handler = container(
      async () => {
        spy1();
      },
      {
        errorHandler: async (err) => {
          expect(err).to.be.equal(error);
          spy2();
        },
        useRegistry: async (registry) => {
          registry.isTest = true; //eslint-disable-line
          spy2();

          return async () => {
            delete registry.isTest; //eslint-disable-line
            spy3();

            throw error;
          };
        },
      },
    );

    try {
      await handler();
    } catch (e) {
      spy4();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
    expect(spy4.called).is.false();

    expect(process.exit.args[0][0]).to.be.equal(1);

    process.exit.restore();
  });

  it('It should test container with error in errorHandler', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    sinon.stub(process, 'exit');
    sinon.stub(console, 'error');

    const error1 = new Error('test1');
    const error2 = new Error('test2');

    const handler = container(
      async () => {
        spy1();

        throw error1;
      },
      {
        errorHandler: async (err) => {
          expect(err).to.be.equal(error1);
          spy2();

          throw error2;
        },
      },
    );

    process.env.STAGE = 'production';

    try {
      await handler();
    } catch (e) {
      spy3();
    }

    delete process.env.STAGE;

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.false();

    expect(process.exit.args[0][0]).to.be.equal(1);

    process.exit.restore();

    expect(console.error.args[0][0]).to.be.equal(error1);
    expect(console.error.args[0][1]).to.be.equal(error2);

    console.error.restore();
  });
});
