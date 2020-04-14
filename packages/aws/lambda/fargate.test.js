const { expect } = require('../../../test.config');

const fargate = require('./fargate');

describe('Lambda fargate test', () => {
  it('It should test default flow', async () => {
    const task = {
      cluster: 'TestCluster',
      taskDefinition: 'TestTaskDefinition:1',
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          securityGroups: ['sg-123456789'],
          subnets: ['subnet-123456789'],
          assignPublicIp: 'ENABLED',
        },
      },
      count: 1,
      overrides: {
        containerOverrides: [{ name: 'TestTask' }],
      },
    };

    const wrapper = {
      errorHandler: async () => {
      },
    };

    const response = await fargate({ task, wrapper })();

    expect(response).to.be.eql({ status: 'success' });
  });
});
