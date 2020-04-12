const { ECS } = require('aws-sdk');

const wrapper = require('./wrapper');

const getClusterParams = () => {
  const {
    CLUSTER_NAME,
    TASK_DEFINITION,
    LAUNCH_TYPE = 'FARGATE',
    SECURITY_GROUPS,
    SUBNETS,
    ASSIGN_PUBLIC_IP = 'ENABLED',
    TASK_NAME,
  } = process.env;

  return {
    cluster: CLUSTER_NAME,
    taskDefinition: TASK_DEFINITION,
    launchType: LAUNCH_TYPE,
    networkConfiguration: {
      awsvpcConfiguration: {
        securityGroups: SECURITY_GROUPS,
        subnets: SUBNETS,
        assignPublicIp: ASSIGN_PUBLIC_IP,
      },
    },
    count: 1,
    overrides: {
      containerOverrides: [{ name: TASK_NAME }],
    },
  };
};

module.exports = wrapper(
  async () => {
    const ecs = new ECS();

    await ecs.runTask(getClusterParams()).promise();
  },
);
