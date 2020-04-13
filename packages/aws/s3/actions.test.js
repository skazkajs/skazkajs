const { expect, sinon } = require('../../../test.config');

const actions = require('./actions');

describe('S3 actions test', () => {
  it('It should test main flow', async () => {
    const name = 'test-bucket';
    const path = '/test.json';
    const data = { testData: true };

    await actions.createBucket(name);

    await actions.uploadFile(name, path, JSON.stringify(data), 'application/json');

    const file = await actions.downloadFile(name, path);

    expect(file.ContentType).to.be.equal('application/json');
    expect(file.Body.toString('utf-8')).to.be.equal(JSON.stringify(data));

    await actions.deleteFile(name, path);

    const deleteErrorSpy = sinon.spy();
    try {
      await actions.downloadFile(name, path);
    } catch (e) {
      expect(e.message).to.be.equal('The specified key does not exist.');

      deleteErrorSpy();
    }

    await actions.deleteBucket(name);

    expect(deleteErrorSpy.called).is.true();
  });
});
