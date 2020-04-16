/* eslint no-console: 0 */

const { expect, sinon } = require('../../../test.config');

const helpers = require('.');

describe('Helpers test', () => {
  it('It should test timeout', async () => {
    const spy = sinon.spy();

    const handler = helpers.timeout(
      async (param) => {
        expect(param).to.be.equal(1);
        spy();
      },
      1,
    );

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test retry', async () => {
    const spy = sinon.spy();

    const handler = helpers.retry(
      async (param) => {
        expect(param).to.be.equal(1);

        spy();

        return 2;
      },
    );

    const response = await handler(1);

    expect(response).to.be.equal(2);

    expect(spy.called).is.true();
  });

  it('It should test timeout with retry', async () => {
    const spy = sinon.spy();

    const handler = await helpers.timeout(
      helpers.retry(
        async (param) => {
          expect(param).to.be.equal(1);

          spy();
        },
        { count: 1 },
      ),
      1,
    );

    await handler(1);

    expect(spy.called).is.true();
  });

  it('It should test retries', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    const handler = helpers.retries(
      [
        async (param) => {
          expect(param).to.be.equal(1);

          spy1();
        },
        async (param) => {
          expect(param).to.be.equal(1);

          spy2();
        },
      ],
      { count: 1 },
    );

    await handler(1);

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
  });

  it('It should test getRegion', async () => {
    expect(helpers.getRegion()).to.be.equal('us-east-1');
  });

  it('It should test isOffline', async () => {
    expect(helpers.isOffline()).is.false();

    process.env.IS_OFFLINE = 1;
    expect(helpers.isOffline()).is.true();
    delete process.env.IS_OFFLINE;
  });

  it('It should test getLocalhost', async () => {
    expect(helpers.getLocalhost()).to.be.equal('localhost');

    process.env.LOCALSTACK_HOSTNAME = 'test';
    expect(helpers.getLocalhost()).to.be.equal('test');
    delete process.env.LOCALSTACK_HOSTNAME;
  });

  it('It should test STAGE_DEV', async () => {
    expect(helpers.STAGE_DEV).to.be.equal('dev');
  });

  it('It should test STAGE_STAGING', async () => {
    expect(helpers.STAGE_STAGING).to.be.equal('staging');
  });

  it('It should test STAGE_TEST', async () => {
    expect(helpers.STAGE_TEST).to.be.equal('test');
  });

  it('It should test STAGE_PRODUCTION', async () => {
    expect(helpers.STAGE_PRODUCTION).to.be.equal('production');
  });

  it('It should test getStage', async () => {
    expect(helpers.getStage()).to.be.equal('dev');

    process.env.STAGE = 'test';
    expect(helpers.getStage()).to.be.equal('test');
    process.env.IS_OFFLINE = 1;
    expect(helpers.getStage()).to.be.equal('dev');
    delete process.env.IS_OFFLINE;
    delete process.env.STAGE;
  });

  it('It should test isDev', async () => {
    expect(helpers.isDev()).is.true();
  });

  it('It should test isStaging', async () => {
    expect(helpers.isStaging()).is.false();

    process.env.STAGE = 'staging';
    expect(helpers.isStaging()).is.true();
    delete process.env.STAGE;
  });

  it('It should test isTest', async () => {
    expect(helpers.isTest()).is.false();

    process.env.STAGE = 'test';
    expect(helpers.isTest()).is.true();
    delete process.env.STAGE;
  });

  it('It should test isProduction', async () => {
    expect(helpers.isProduction()).is.false();

    process.env.STAGE = 'production';
    expect(helpers.isProduction()).is.true();
    delete process.env.STAGE;
  });

  it('It should test LAMBDA_RESPONSE', async () => {
    expect(helpers.LAMBDA_RESPONSE).to.be.eql({ status: 'success' });
  });

  it('It should test LAMBDA_SMOKE_TEST_EVENT', async () => {
    expect(helpers.LAMBDA_SMOKE_TEST_EVENT).to.be.eql({ isSmokeTest: true });
  });

  it('It should test SSM_PORT', async () => {
    expect(helpers.SSM_PORT).to.be.equal('4583');
  });

  it('It should test getSSMPort', async () => {
    expect(helpers.getSSMPort()).to.be.equal('4583');
  });

  it('It should test S3_PORT', async () => {
    expect(helpers.S3_PORT).to.be.equal('4572');
  });

  it('It should test getS3Port', async () => {
    expect(helpers.getS3Port()).to.be.equal('4572');
  });

  it('It should test DYNAMODB_PORT', async () => {
    expect(helpers.DYNAMODB_PORT).to.be.equal('4569');
  });

  it('It should test getDynamoDbPort', async () => {
    expect(helpers.getDynamoDbPort()).to.be.equal('4569');
  });

  it('It should test compareSimpleObjects', async () => {
    expect(helpers.compareSimpleObjects({ test: true }, { test: true })).is.true();
  });

  it('It should test clearDataForDynamoDB', async () => {
    expect(helpers.clearDataForDynamoDB({ test: true, data: '' })).to.be.eql({
      test: true,
      data: null,
    });
  });

  it('It should test createError', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    try {
      throw helpers.createError('test');
    } catch (e) {
      expect(e.message).to.be.equal('test');
      expect(e.payload).is.null();

      spy1();
    }

    try {
      throw helpers.createError('test', 'payload');
    } catch (e) {
      expect(e.message).to.be.equal('test');
      expect(e.payload).to.be.equal('payload');

      spy2();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
  });

  it('It should test processRecursiveRows', async () => {
    const spy = sinon.spy();

    const processRow = async (param) => {
      expect(param).to.be.equal(1);

      spy();
    };

    await helpers.processRecursiveRows(processRow, [1]);

    expect(spy.called).is.true();
  });

  it('It should test defaultSmokeTestHandler', async () => {
    const event = { event: true };
    const context = { context: true };

    sinon.stub(console, 'log');

    expect(
      await helpers.defaultSmokeTestHandler(event, context),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    expect(console.log.args.length).to.be.equal(0);

    process.env.STAGE = 'production';
    expect(
      await helpers.defaultSmokeTestHandler(event, context),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    delete process.env.STAGE;

    expect(console.log.args[0][0]).to.be.equal(event);
    expect(console.log.args[0][1]).to.be.equal(context);

    console.log.restore();
  });

  it('It should test defaultErrorHandler', async () => {
    const error = { error: true };
    const payload = { payload: true };

    sinon.stub(console, 'error');

    expect(
      await helpers.defaultErrorHandler(error),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    expect(
      await helpers.defaultErrorHandler(error, payload),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    expect(console.error.args.length).to.be.equal(0);

    process.env.STAGE = 'production';
    expect(
      await helpers.defaultErrorHandler(error),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    expect(
      await helpers.defaultErrorHandler(error, payload),
    ).to.be.equal(helpers.LAMBDA_RESPONSE);
    delete process.env.STAGE;

    expect(console.error.args[0][0]).to.be.equal(error);
    expect(console.error.args[0][1]).is.null();

    expect(console.error.args[1][0]).to.be.equal(error);
    expect(console.error.args[1][1]).to.be.equal(payload);

    console.error.restore();
  });

  it('It should test processRowWrapper', async () => {
    const spy1 = sinon.spy();

    const handler1 = helpers.processRowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy1();
      },
    );

    await handler1(1);

    expect(spy1.called).is.true();

    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const spy4 = sinon.spy();

    const error = new Error('test');

    const handler2 = helpers.processRowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy2();

        throw error;
      },
      {
        throwError: true,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error);
          expect(payload).to.be.eql([1]);

          spy3();
        },
      },
    );

    try {
      await handler2(1);
    } catch (e) {
      expect(e).to.be.equal(error);

      spy4();
    }

    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
    expect(spy4.called).is.true();

    const spy5 = sinon.spy();
    const spy6 = sinon.spy();
    const spy7 = sinon.spy();

    const error1 = new Error('test');

    const handler3 = helpers.processRowWrapper(
      async (param) => {
        expect(param).to.be.equal(1);
        spy5();

        throw error1;
      },
      {
        throwError: false,
        errorHandler: async (err, payload) => {
          expect(err).to.be.equal(error1);
          expect(payload).to.be.eql([1]);

          spy6();
        },
      },
    );

    try {
      await handler3(1);
    } catch (e) {
      expect(e).to.be.equal(error);

      spy7();
    }

    expect(spy5.called).is.true();
    expect(spy6.called).is.true();
    expect(spy7.called).is.false();
  });

  it('It should test retry with options', async () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();

    const error = new Error('test');

    const handler = helpers.retry(
      async (param) => {
        expect(param).to.be.equal(1);

        spy1();

        throw error;
      },
      {
        count: 2,
        timeout: 1,
        errorHandler: async (err) => {
          expect(err).to.be.equal(error);

          spy2();
        },
      },
    );

    try {
      await handler(1);
    } catch (e) {
      expect(e).to.be.equal(error);

      spy3();
    }

    expect(spy1.called).is.true();
    expect(spy2.called).is.true();
    expect(spy3.called).is.true();
  });

  it('It should test getAccessKeyId', async () => {
    expect(helpers.getAccessKeyId()).to.be.equal('AWS_ACCESS_KEY_ID');

    process.env.AWS_ACCESS_KEY_ID = 'test';
    expect(helpers.getAccessKeyId()).to.be.equal('test');
    delete process.env.AWS_ACCESS_KEY_ID;
  });

  it('It should test getSecretAccessKey', async () => {
    expect(helpers.getSecretAccessKey()).to.be.equal('AWS_SECRET_ACCESS_KEY');

    process.env.AWS_SECRET_ACCESS_KEY = 'test';
    expect(helpers.getSecretAccessKey()).to.be.equal('test');
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });
});
