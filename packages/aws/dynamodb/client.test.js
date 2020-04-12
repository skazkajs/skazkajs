const { expect } = require('../../../test.config');

const {
  isDev,
  getLocalhost,
  getRegion,
  getDynamoDbPort,
} = require('../helpers');

const { init, clear } = require('./test');

const { dynamoDB, dynamoDBClient } = require('./client');

describe('DynamoDB client test', () => {
  const TableName = 'users-dev';

  before(async () => {
    await init();
  });

  after(async () => {
    await clear();
  });

  it('It should test connection parameters', async () => {
    expect(isDev()).to.be.true();
    expect(getRegion()).to.be.equal('us-east-1');
    expect(getLocalhost()).to.be.equal('localhost');
    expect(getDynamoDbPort()).to.be.equal('4569');
  });

  it('It should test dynamoDB', async () => {
    const tableInfo = await dynamoDB.describeTable({ TableName }).promise();

    expect(tableInfo).to.containSubset({
      Table: {
        TableName: 'users-dev',
        AttributeDefinitions: [
          {
            AttributeName: 'email',
            AttributeType: 'S',
          },
        ],
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH',
          },
        ],
        TableStatus: 'ACTIVE',
        TableSizeBytes: 0,
        ItemCount: 0,
        TableArn: 'arn:aws:dynamodb:us-east-1:000000000000:table/users-dev',
        BillingModeSummary: {
          BillingMode: 'PAY_PER_REQUEST',
        },
        StreamSpecification: {
          StreamEnabled: true,
          StreamViewType: 'NEW_AND_OLD_IMAGES',
        },
      },
    });
  });

  it('It should test dynamoDBClient', async () => {
    const create = (user) => dynamoDBClient.put({ TableName, Item: user }).promise();
    const get = (email) => (
      dynamoDBClient.get({ TableName, Key: { email } }).promise()
    ).then((result) => result.Item);
    const getAll = () => (
      dynamoDBClient.scan({ TableName }).promise()
    ).then((result) => result.Items);
    const remove = (email) => dynamoDBClient.delete({ TableName, Key: { email } }).promise();

    const user = {
      email: 'test@test.test',
      name: 'test',
    };

    await create(user);

    const savedUser = await get('test@test.test');
    expect(savedUser).to.be.eql(user);

    const savedUsers = await getAll();
    expect(savedUsers.length).to.be.equal(1);
    expect(savedUsers[0]).to.be.eql(user);

    await remove('test@test.test');
    const users = await getAll();
    expect(users.length).to.be.equal(0);
  });
});
