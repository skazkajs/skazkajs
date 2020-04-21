const { expect } = require('../../../test.config');

const env = require('.');

describe('Env test', () => {
  it('It should test isOffline', async () => {
    expect(env.isOffline()).is.false();

    process.env.IS_OFFLINE = 1;
    expect(env.isOffline()).is.true();
    delete process.env.IS_OFFLINE;
  });

  it('It should test getStage', async () => {
    expect(env.getStage()).to.be.equal('dev');

    process.env.STAGE = 'test';
    expect(env.getStage()).to.be.equal('test');
    process.env.IS_OFFLINE = 1;
    expect(env.getStage()).to.be.equal('dev');
    delete process.env.IS_OFFLINE;
    delete process.env.STAGE;
  });

  it('It should test isDev', async () => {
    expect(env.isDev()).is.true();
  });

  it('It should test isStaging', async () => {
    expect(env.isStaging()).is.false();

    process.env.STAGE = 'staging';
    expect(env.isStaging()).is.true();
    delete process.env.STAGE;
  });

  it('It should test isTest', async () => {
    expect(env.isTest()).is.false();

    process.env.STAGE = 'test';
    expect(env.isTest()).is.true();
    delete process.env.STAGE;
  });

  it('It should test isProduction', async () => {
    expect(env.isProduction()).is.false();

    process.env.STAGE = 'production';
    expect(env.isProduction()).is.true();
    delete process.env.STAGE;
  });

  it('It should test getRegion', async () => {
    expect(env.getRegion()).to.be.equal('us-east-1');
  });

  it('It should test getLocalhost', async () => {
    expect(env.getLocalhost()).to.be.equal('localhost');

    process.env.LOCALSTACK_HOSTNAME = 'test';
    expect(env.getLocalhost()).to.be.equal('test');
    delete process.env.LOCALSTACK_HOSTNAME;
  });

  it('It should test getAccessKeyId', async () => {
    expect(env.getAccessKeyId()).to.be.equal('AWS_ACCESS_KEY_ID');

    process.env.AWS_ACCESS_KEY_ID = 'test';
    expect(env.getAccessKeyId()).to.be.equal('test');
    delete process.env.AWS_ACCESS_KEY_ID;
  });

  it('It should test getSecretAccessKey', async () => {
    expect(env.getSecretAccessKey()).to.be.equal('AWS_SECRET_ACCESS_KEY');

    process.env.AWS_SECRET_ACCESS_KEY = 'test';
    expect(env.getSecretAccessKey()).to.be.equal('test');
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });
});
