const { expect } = require('../../../test.config');

const convert = require('./convert');

describe('DynamoDB convert test', () => {
  it('It should test DynamoDB convert - create', async () => {
    const eventData = JSON.parse(`{
          "eventID":"1",
          "eventName":"INSERT",
          "eventVersion":"1.0",
          "eventSource":"aws:dynamodb",
          "awsRegion":"us-east-1",
          "dynamodb":{
            "Keys":{
              "Id":{
                "N":"1"
              }
            },
            "NewImage":{
              "Message":{
                "S":"New item"
              },
              "Id":{
                "N":"1"
              }
            },
            "SequenceNumber":"111",
            "SizeBytes":26,
            "StreamViewType":"NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN":"stream-ARN"
        }`);

    expect(convert(eventData)).to.be.eql({ newData: { Id: 1, Message: 'New item' }, oldData: {} });
  });

  it('It should test DynamoDB convert - delete', async () => {
    const eventData = JSON.parse(`{
          "eventID":"1",
          "eventName":"REMOVE",
          "eventVersion":"1.0",
          "eventSource":"aws:dynamodb",
          "awsRegion":"us-east-1",
          "dynamodb":{
            "Keys":{
              "Id":{
                "N":"1"
              }
            },
            "OldImage":{
              "Message":{
                "S":"Old item"
              },
              "Id":{
                "N":"1"
              }
            },
            "SequenceNumber":"111",
            "SizeBytes":26,
            "StreamViewType":"NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN":"stream-ARN"
        }`);

    expect(convert(eventData)).to.be.eql({ newData: {}, oldData: { Id: 1, Message: 'Old item' } });
  });
});
