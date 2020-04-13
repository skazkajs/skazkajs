const { expect } = require('../../../test.config');

const actions = require('./actions');

describe('SSM actions test', () => {
  it('It should test main flow', async () => {
    await actions.putParameter('test1', 'data1', true);
    await actions.putParameter('test2', 'data2');
    await actions.putParameter('test3', 'data3');
    await actions.putParameter('test4', 'data4', false);

    expect(await actions.getParameter('test1', true)).to.be.equal('data1');
    expect(await actions.getParameter('test1')).to.be.equal('data1');

    const params = await actions.getParameters(['test2', 'test3']);
    expect(Object.keys(params).length).to.be.equal(2);
    expect(params.test2).to.be.equal('data2');
    expect(params.test3).to.be.equal('data3');

    expect(await actions.getParameter('test4', false)).to.be.equal('data4');
    expect(Object.keys(await actions.getParameters(['test4'], false)).length).to.be.equal(1);

    await actions.deleteParameter('test1');
    await actions.deleteParameters(['test2', 'test3', 'test4']);

    const parameters = await actions.getParameters(['test1', 'test2', 'test3', 'test4']);
    expect(Object.keys(parameters).length).to.be.equal(0);
  });
});
