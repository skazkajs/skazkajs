const { dynamoDBClient } = require('./client');

const getItem = async (TableName, Key, options = {}) => (
  dynamoDBClient.get({ TableName, Key, ...options }).promise().then((result) => result.Item)
);

const getItems = (TableName) => (
  dynamoDBClient.scan({ TableName }).promise()
).then((result) => result.Items);

const getAllItems = (TableName) => (
  dynamoDBClient.scan({ TableName }).promise()
).then((result) => result.Items);

const createItem = async (TableName, Item, options = {}) => (
  dynamoDBClient.put({ TableName, Item, ...options }).promise()
);

const deleteItem = async (TableName, Key) => (
  dynamoDBClient.delete({ TableName, Key }).promise()
);

const updateItem = async (TableName, Key, data = {}, options = {}) => {
  const keys = Object.keys(data);

  const expressionList = [];

  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  keys.forEach((key) => {
    const clearKey = key.replace(/[^a-z0-9]/gi, '');

    expressionList.push(`#${clearKey} = :${clearKey}`);
    ExpressionAttributeNames[`#${clearKey}`] = key;
    ExpressionAttributeValues[`:${clearKey}`] = data[key];
  });

  const updateParameters = {
    TableName,
    Key,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression: `SET ${expressionList.join(', ')}`,
    ReturnValues: 'ALL_NEW',
    ...options,
  };

  const newData = await dynamoDBClient.update(updateParameters).promise();

  return newData.Attributes;
};

const createItemWithVersion = async (TableName, Item, options = {}) => createItem(
  TableName,
  {
    ...Item,
    version: 1,
    versionDate: new Date().getTime(),
  },
  options,
);

const updateItemWithVersion = async (TableName, Key, data, options = {}) => {
  const keys = Object.keys(data);

  if (keys.length) {
    const expressionList = [];

    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};

    keys.forEach((key) => {
      if (!['versionDate', 'version'].includes(key) && data[key]) {
        expressionList.push(`#${key} = :${key}`);
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:${key}`] = data[key];
      }
    });

    expressionList.push('#version = if_not_exists(#version, :zero) + :increase');
    ExpressionAttributeNames['#version'] = 'version';
    ExpressionAttributeValues[':zero'] = 0;
    ExpressionAttributeValues[':increase'] = 1;

    expressionList.push('#versionDate = :versionDate');
    ExpressionAttributeNames['#versionDate'] = 'versionDate';
    ExpressionAttributeValues[':versionDate'] = new Date().getTime();

    return updateItem(
      TableName,
      Key,
      data,
      {
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        UpdateExpression: `SET ${expressionList.join(', ')}`,
        ...options,
      },
    );
  }

  return null;
};

const createItemWithUniqueAttribute = async (TableName, Item, attribute, options = {}) => (
  createItem(
    TableName,
    Item,
    {
      ConditionExpression: 'attribute_not_exists(#attribute)',
      ExpressionAttributeNames: { '#attribute': attribute },
      ...options,
    },
  )
);

module.exports = {
  getItem,
  getItems,
  getAllItems,
  createItem,
  deleteItem,
  updateItem,
  createItemWithVersion,
  updateItemWithVersion,
  createItemWithUniqueAttribute,
};
