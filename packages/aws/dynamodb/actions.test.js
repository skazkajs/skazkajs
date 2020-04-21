const { expect } = require('../../../test.config');

const { init, clear } = require('./fake');

const actions = require('./actions');

describe('DynamoDB actions test', () => {
  const TableName = 'users-dev';

  before(async () => {
    await init();
  });

  after(async () => {
    await clear();
  });

  it('It should test main flow', async () => {
    const userData = {
      email: 'test@test.test',
      name: 'test',
    };

    const userModel = {
      create: async (data) => actions.createItem(TableName, data),
      get: async (email) => actions.getItem(TableName, { email }),
      remove: async (email) => actions.deleteItem(TableName, { email }),
      list: async () => actions.getItems(TableName),
      all: async () => actions.getAllItems(TableName),
    };

    await userModel.create(userData);

    const savedUser = await userModel.get('test@test.test');
    expect(savedUser).to.be.eql(userData);

    const listUsers = await userModel.list();
    expect(listUsers.length).to.be.equal(1);
    expect(listUsers[0]).to.be.eql(userData);

    const allUsers = await userModel.all();
    expect(allUsers.length).to.be.equal(1);
    expect(allUsers[0]).to.be.eql(userData);

    await userModel.remove('test@test.test');
    const users = await userModel.list();
    expect(users.length).to.be.equal(0);
  });
});
