const core = require('.');

describe('Server core test', async () => {
  test('It should work with one fn', async () => {
    const mock = jest.fn();

    const context = {};

    const modules = [
      async (ctx) => {
        mock(ctx);
      },
    ];

    await core(context, modules);

    expect(mock).toHaveBeenCalledWith(context);
  });
  test('It should work with 3 fns', async () => {
    const mock = jest.fn();

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

    expect(mock).toHaveBeenCalledWith(context);
    expect(mock).toHaveBeenCalledTimes(3);
  });
  test('It should work with error', async () => {
    const mock = jest.fn();

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
      expect(e).toEqual(error);
    }

    expect(mock).toHaveBeenCalledWith(context);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});
