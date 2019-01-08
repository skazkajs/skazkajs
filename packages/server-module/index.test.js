const Context = require('@skazka/server-context');

const serverModule = require('.');

const normalContext = new Context(null);

describe('Server module test', () => {
  describe('Function test', () => {
    describe('Without context test', () => {
      test('It should test 0 parameters', () => {
        const mock = jest.fn();

        const app = serverModule((context) => {
          mock(context);
        });

        app()(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext);
      });
      test('It should test 1 parameter', () => {
        const mock = jest.fn();
        const options = {};

        const app = serverModule((context, opts) => {
          mock(context, opts);
        });

        app(options)(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext, options);
      });
      test('It should test 2 parameters', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        app(option1, option2)(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test error', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          app(option1, option2)(normalContext);
        } catch (e) {
          expect(e.message).toEqual('test');
        }

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test wrong context', () => {
        const mock = jest.fn();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2)(ctx);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
      test('It should test context in wrong place', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
    });
    describe('With context test', () => {
      test('It should test 0 parameters', () => {
        const mock = jest.fn();

        const app = serverModule((context) => {
          mock(context);
        });

        app(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext);
      });
      test('It should test 1 parameter', () => {
        const mock = jest.fn();
        const options = {};

        const app = serverModule((context, opts) => {
          mock(context, opts);
        });

        app(normalContext, options);

        expect(mock).toHaveBeenCalledWith(normalContext, options);
      });
      test('It should test 2 parameters', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        app(normalContext, option1, option2);

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test error', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          app(normalContext, option1, option2);
        } catch (e) {
          expect(e.message).toEqual('test');
        }

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test wrong context', () => {
        const mock = jest.fn();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(ctx, option1, option2);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
      test('It should test context in wrong place', () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule((context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
  describe('Promise test', () => {
    describe('Without context test', () => {
      test('It should test 0 parameters', async () => {
        const mock = jest.fn();

        const app = serverModule(async (context) => {
          mock(context);
        });

        await app()(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext);
      });
      test('It should test 1 parameter', async () => {
        const mock = jest.fn();
        const options = {};

        const app = serverModule(async (context, opts) => {
          mock(context, opts);
        });

        await app(options)(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext, options);
      });
      test('It should test 2 parameters', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        await app(option1, option2)(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test error', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          await app(option1, option2)(normalContext);
        } catch (e) {
          expect(e.message).toEqual('test');
        }

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test wrong context', async () => {
        const mock = jest.fn();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2)(ctx);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
      test('It should test context in wrong place', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
    });
    describe('With context test', () => {
      test('It should test 0 parameters', async () => {
        const mock = jest.fn();

        const app = serverModule(async (context) => {
          mock(context);
        });

        await app(normalContext);

        expect(mock).toHaveBeenCalledWith(normalContext);
      });
      test('It should test 1 parameter', async () => {
        const mock = jest.fn();
        const options = {};

        const app = serverModule(async (context, opts) => {
          mock(context, opts);
        });

        await app(normalContext, options);

        expect(mock).toHaveBeenCalledWith(normalContext, options);
      });
      test('It should test 2 parameters', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        await app(normalContext, option1, option2);

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test error', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
          throw new Error('test');
        });

        try {
          await app(normalContext, option1, option2);
        } catch (e) {
          expect(e.message).toEqual('test');
        }

        expect(mock).toHaveBeenCalledWith(normalContext, option1, option2);
      });
      test('It should test wrong context', async () => {
        const mock = jest.fn();
        const ctx = {};
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(ctx, option1, option2);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
      test('It should test context in wrong place', async () => {
        const mock = jest.fn();
        const option1 = {};
        const option2 = {};

        const app = serverModule(async (context, opt1, opt2) => {
          mock(context, opt1, opt2);
        });

        try {
          await app(option1, option2, normalContext);
        } catch (e) {
          expect(e.message).toEqual('Context should be the first parameter!');
        }

        expect(mock).not.toHaveBeenCalled();
      });
    });
  });
});
