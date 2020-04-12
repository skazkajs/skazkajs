/* eslint no-console: 0 */

const { dynamoDBClient } = require('./client');

const getItem = async (TableName, Key, options = {}) => {
  console.log('DynamoDB Model: getItem');
  console.log('TableName:', TableName);
  console.log('Key:', Key);
  console.log('Options:', JSON.stringify(options, null, 2));

  return dynamoDBClient.get({ TableName, Key, ...options }).promise().then((result) => result.Item);
};

const createItem = async (TableName, Item, options = {}) => {
  console.log('DynamoDB Model: createItem');
  console.log('TableName:', TableName);
  console.log('Item:', Item);
  console.log('Options:', JSON.stringify(options, null, 2));

  return dynamoDBClient.put({ TableName, Item, ...options }).promise();
};

const deleteItem = async (TableName, Key) => {
  console.log('DynamoDB Model: deleteItem');
  console.log('TableName:', TableName);
  console.log('Key:', Key);

  return dynamoDBClient.delete({ TableName, Key }).promise();
};

const updateItem = async (TableName, Key, data = {}, options = {}) => {
  console.log('DynamoDB Model: updateItem');
  console.log('TableName:', TableName);
  console.log('Key:', Key);
  console.log('data:', data);
  console.log('Options:', JSON.stringify(options, null, 2));

  const keys = Object.keys(data);
  console.log('Keys:', JSON.stringify(keys, null, 2));

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

  console.log('Update parameters:', JSON.stringify(updateParameters, null, 2));

  console.log('Updating the record...');
  const newData = await dynamoDBClient.update(updateParameters).promise();
  console.log('New data:', JSON.stringify(newData, null, 2));

  return newData.Attributes;
};

const createItemWithVersion = async (TableName, Item, options = {}) => {
  console.log('DynamoDB Model: createItemWithVersion');
  console.log('TableName:', TableName);
  console.log('Item:', JSON.stringify(Item, null, 2));

  return createItem(
    TableName,
    {
      ...Item,
      version: 1,
      versionDate: new Date().getTime(),
    },
    options,
  );
};

const updateItemWithVersion = async (TableName, Key, data, options = {}) => {
  console.log('DynamoDB Model: updateItemWithVersion');
  console.log('TableName:', TableName);
  console.log('Key:', Key);
  console.log('data:', data);
  console.log('Options:', JSON.stringify(options, null, 2));

  const keys = Object.keys(data);
  console.log('Keys:', JSON.stringify(keys, null, 2));

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

const createItemWithUniqueAttribute = async (TableName, Item, attribute, options = {}) => {
  console.log('DynamoDB Model: createItemWithUniqueAttribute');
  console.log('TableName:', TableName);
  console.log('Item:', Item);
  console.log('Attribute:', attribute);
  console.log('Options:', JSON.stringify(options, null, 2));

  return createItem(
    TableName,
    Item,
    {
      ConditionExpression: 'attribute_not_exists(#attribute)',
      ExpressionAttributeNames: { '#attribute': attribute },
      ...options,
    },
  );
};

module.exports = {
  getItem,
  createItem,
  deleteItem,
  updateItem,
  createItemWithVersion,
  updateItemWithVersion,
  createItemWithUniqueAttribute,
};
