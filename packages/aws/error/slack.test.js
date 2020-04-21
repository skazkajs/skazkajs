/* eslint no-console: 0 */

const moxios = require('moxios'); // eslint-disable-line

const { expect, sinon } = require('../../../test.config');

const actions = require('../ssm/actions');

const errorHandler = require('./slack');

describe('Lambda error slack test', () => {
  it('It should test main flow', async () => {
    moxios.install();

    const errorHandlerWithChannel = errorHandler('/channel');
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = new Error('test');
    const payload = { payload: true };

    const spy = sinon.spy();

    sinon.stub(console, 'error');

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      const data = JSON.parse(request.config.data);
      const text = JSON.parse(data.text);

      expect(text).to.be.eql({
        name: 'name',
        stage: 'staging',
        region: 'us-east-1',
        error: 'test',
        payload: {
          payload: true,
        },
      });

      spy();

      request.respondWith({ status: 200, response: { status: 'ok' } });
    });

    process.env.STAGE = 'staging';

    await errorHandlerWithChannelAndName(error, payload);

    delete process.env.STAGE;

    moxios.uninstall();

    expect(spy.called).is.true();

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'staging',
      region: 'us-east-1',
      error: 'test',
      payload: {
        payload: true,
      },
    }, null, 2));

    console.error.restore();
  });

  it('It should test main for dev flow', async () => {
    const errorHandlerWithChannel = errorHandler('/channel');
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = new Error('test');
    const payload = { payload: true };

    sinon.stub(console, 'error');

    await errorHandlerWithChannelAndName(error, payload);

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'dev',
      region: 'us-east-1',
      error: 'test',
      payload: {
        payload: true,
      },
    }, null, 2));

    console.error.restore();
  });

  it('It should test ssm for dev flow', async () => {
    await actions.putParameter('channelName', '/channel');

    const errorHandlerWithChannel = errorHandler('channelName', { useSSM: true });
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = new Error('test');
    const payload = { payload: true };

    sinon.stub(console, 'error');

    await errorHandlerWithChannelAndName(error, payload);

    await actions.deleteParameter('channelName');

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'dev',
      region: 'us-east-1',
      error: 'test',
      payload: {
        payload: true,
      },
    }, null, 2));

    console.error.restore();
  });

  it('It should test main for dev without payload flow', async () => {
    const errorHandlerWithChannel = errorHandler('/channel');
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = new Error('test');

    sinon.stub(console, 'error');

    await errorHandlerWithChannelAndName(error);

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'dev',
      region: 'us-east-1',
      error: 'test',
      payload: null,
    }, null, 2));

    console.error.restore();
  });

  it('It should test main for dev without error flow', async () => {
    const errorHandlerWithChannel = errorHandler('/channel');
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = 'test';
    const payload = { payload: true };

    sinon.stub(console, 'error');

    await errorHandlerWithChannelAndName(error, payload);

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'dev',
      region: 'us-east-1',
      error: 'test',
      payload: {
        payload: true,
      },
    }, null, 2));

    console.error.restore();
  });

  it('It should test main with error flow', async () => {
    moxios.install();

    const errorHandlerWithChannel = errorHandler('/channel');
    const errorHandlerWithChannelAndName = errorHandlerWithChannel('name');

    const error = new Error('test');
    const payload = { payload: true };

    const spy = sinon.spy();

    sinon.stub(console, 'error');

    moxios.wait(() => {
      const request = moxios.requests.mostRecent();

      const data = JSON.parse(request.config.data);
      const text = JSON.parse(data.text);

      expect(text).to.be.eql({
        name: 'name',
        stage: 'staging',
        region: 'us-east-1',
        error: 'test',
        payload: {
          payload: true,
        },
      });

      spy();

      request.respondWith({ status: 500, response: { status: 'error' } });
    });

    process.env.STAGE = 'staging';

    await errorHandlerWithChannelAndName(error, payload);

    delete process.env.STAGE;

    moxios.uninstall();

    expect(spy.called).is.true();

    expect(console.error.args[0][0]).to.be.eql(JSON.stringify({
      name: 'name',
      stage: 'staging',
      region: 'us-east-1',
      error: 'test',
      payload: {
        payload: true,
      },
    }, null, 2));
    expect(console.error.args[1][0].message).to.be.equal('Request failed with status code 500');

    console.error.restore();
  });
});
