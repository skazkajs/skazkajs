const { DynamoDB } = require('aws-sdk');

const { unmarshall } = DynamoDB.Converter;

const convert = ({ dynamodb: { OldImage, NewImage } }) => {
  const oldData = OldImage ? unmarshall(OldImage) : {};
  const newData = NewImage ? unmarshall(NewImage) : {};

  return { oldData, newData };
};

module.exports = convert;
