const Context = require('@skazka/server-context');

const { expect, sinon } = require('../../../test.config');

const serverModule = require('.');

const normalContext = new Context(null);

describe('Server module test', () => {
  describe('Function test', () => {
    describe('Without context test', () => {
      it('It should test 0 parameters', () => {
        const mock = sinon.spy();

        const app = serverModule((context) => {
          mock(context);
        });

        app()(normalContext);

        expect(mock.calledWith(normalContext)).is.true();
      });
      it('It should test 1 parameter', () => {
        const mock = sinon.spy();
        const options = {};

        const app = serverModule((context, opts) => {
          mock(context, opts);
        });

        app(options)(normalContext);

        expect(mock.calledWith(normalContext, options)).is.true();
      });
      it('It should test 2 parameters', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        app(option1, option2)(normalContext);

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test error', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          app(option1, option2)(normalContext);
        } catch (e) {
          expect(e.message).equal('test');
        }

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test wrong context', () => {
        const mock = sinon.spy();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2)(ctx);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
      it('It should test context in wrong place', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
    });
    describe('With context test', () => {
      it('It should test 0 parameters', () => {
        const mock = sinon.spy();

        const app = serverModule((context) => {
          mock(context);
        });

        app(normalContext);

        expect(mock.calledWith(normalContext)).is.true();
      });
      it('It should test 1 parameter', () => {
        const mock = sinon.spy();
        const options = {};

        const app = serverModule((context, opts) => {
          mock(context, opts);
        });

        app(normalContext, options);

        expect(mock.calledWith(normalContext, options)).is.true();
      });
      it('It should test 2 parameters', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        app(normalContext, option1, option2);

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test error', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          app(normalContext, option1, option2);
        } catch (e) {
          expect(e.message).equal('test');
        }

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test wrong context', () => {
        const mock = sinon.spy();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(ctx, option1, option2);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
      it('It should test context in wrong place', () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
    });
  });
  describe('Promise test', () => {
    describe('Without context test', () => {
      it('It should test 0 parameters', async () => {
        const mock = sinon.spy();

        const app = serverModule(async (context) => {
          mock(context);
        });

        await app()(normalContext);

        expect(mock.calledWith(normalContext)).is.true();
      });
      it('It should test 1 parameter', async () => {
        const mock = sinon.spy();
        const options = {};

        const app = serverModule(async (context, opts) => {
          mock(context, opts);
        });

        await app(options)(normalContext);

        expect(mock.calledWith(normalContext, options)).is.true();
      });
      it('It should test 2 parameters', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        await app(option1, option2)(normalContext);

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test error', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          await app(option1, option2)(normalContext);
        } catch (e) {
          expect(e.message).equal('test');
        }

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test wrong context', async () => {
        const mock = sinon.spy();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2)(ctx);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
      it('It should test context in wrong place', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
    });
    describe('With context test', () => {
      it('It should test 0 parameters', async () => {
        const mock = sinon.spy();

        const app = serverModule(async (context) => {
          mock(context);
        });

        await app(normalContext);

        expect(mock.calledWith(normalContext)).is.true();
      });
      it('It should test 1 parameter', async () => {
        const mock = sinon.spy();
        const options = {};

        const app = serverModule(async (context, opts) => {
          mock(context, opts);
        });

        await app(normalContext, options);

        expect(mock.calledWith(normalContext, options)).is.true();
      });
      it('It should test 2 parameters', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        await app(normalContext, option1, option2);

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test error', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          await app(normalContext, option1, option2);
        } catch (e) {
          expect(e.message).equal('test');
        }

        expect(mock.calledWith(normalContext, option1, option2)).is.true();
      });
      it('It should test wrong context', async () => {
        const mock = sinon.spy();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(ctx, option1, option2);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
      it('It should test context in wrong place', async () => {
        const mock = sinon.spy();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).equal('Context should be the first parameter!');
        }

        expect(mock.called).is.false();
      });
    });
  });
});
