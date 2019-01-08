const Context = require('.');

describe('Server context test', async () => {
  test('It should test context', async () => {
    const context = new Context();

    const that = context.set('test', 'test');

    expect(context).toEqual(that);
    expect(context.test).toEqual('test');
    expect(context.get('test')).toEqual('test');
  });

  test('It should test context with existing value', async () => {
    const mock = jest.fn();

    const context = new Context();

    context.set('test', 'test');

    try {
      context.set('test', 'newTest');
    } catch (e) {
      expect(e.message).toEqual('Value for test already set!');
      mock();
    }

    expect(mock).toHaveBeenCalled();
  });

  test('It should test context with existing value and rewrite', async () => {
    const mock = jest.fn();

    const context = new Context();

    context.set('test', 'test');

    try {
      context.set('test', 'newTest', true);
    } catch (e) {
      mock();
    }

    expect(mock).not.toHaveBeenCalled();
    expect(context.get('test')).toEqual('newTest');
  });
});
