const { EC2 } = require('aws-sdk');

const wrapper = require('./wrapper');

module.exports = wrapper(
  async () => {
    const { ACTION, INSTANCE } = process.env;

    const params = { InstanceIds: [INSTANCE] };

    const ec2 = new EC2();

    const status = await ec2.describeInstances(params).promise();

    const instanceState = status.Reservations[0].Instances[0].State.Name;

    if (!['start', 'stop'].includes(ACTION)) {
      throw new Error('Wrong serverless.yml "ACTION"! It should "start" or "stop" the instance!');
    }

    if (!['running', 'pending', 'stopped', 'stopping'].includes(instanceState)) {
      throw new Error('Wrong instance state!');
    }

    if (ACTION === 'start') {
      if (instanceState === 'stopping') {
        throw new Error('The instance is not in a state from which it can be started!');
      }

      if (!['running', 'pending'].includes(instanceState)) {
        await ec2.startInstances(params).promise();
      }
    }

    if (ACTION === 'stop') {
      if (instanceState === 'pending') {
        throw new Error('The instance is not in a state from which it can be stopped!');
      }

      if (!['stopped', 'stopping'].includes(instanceState)) {
        await ec2.stopInstances(params).promise();
      }
    }
  },
);
