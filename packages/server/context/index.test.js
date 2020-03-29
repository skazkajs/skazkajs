const { expect, sinon } = require('../../../test.config');

const Context = require('.');

describe('Server context test', async () => {
  it('It should test context', async () => {
    const context = new Context();

    const that = context.set('test', 'test');

    expect(context).equal(that);
    expect(context.test).equal('test');
    expect(context.get('test')).equal('test');
  });

  it('It should test context with existing value', async () => {
    const mock = sinon.spy();

    const context = new Context();

    context.set('test', 'test');

    try {
      context.set('test', 'newTest');
    } catch (e) {
      expect(e.message).equal('Value for test already set!');
      mock();
    }

    expect(mock.called).is.true();
  });

  it('It should test context with existing value and rewrite', async () => {
    const mock = sinon.spy();

    const context = new Context();

    context.set('test', 'test');

    try {
      context.set('test', 'newTest', true);
    } catch (e) {
      mock();
    }

    expect(mock.called).is.false();
    expect(context.get('test')).equal('newTest');
  });
});
