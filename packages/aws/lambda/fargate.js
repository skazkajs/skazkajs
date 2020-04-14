const { ECS } = require('aws-sdk');

const wrapper = require('./wrapper');

module.exports = (options) => wrapper(
  async () => {
    const ecs = new ECS(options && options.ecs);

    await ecs.runTask(options.task).promise();
  },
  options && options.wrapper,
);
