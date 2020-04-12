const { expect } = require('../../../test.config');

const events = require('./events');

describe('DynamoDB events test', () => {
  it('It should test dynamoDB stream events', async () => {
    expect(Object.keys(events).length).to.be.equal(3);
    expect(events.INSERT).to.be.equal('INSERT');
    expect(events.MODIFY).to.be.equal('MODIFY');
    expect(events.REMOVE).to.be.equal('REMOVE');
  });
});
