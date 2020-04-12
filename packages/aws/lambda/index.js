/* istanbul ignore file */

const error = require('./error');
const ec2 = require('./ec2');
const event = require('./event');
const fargate = require('./fargate');
const http = require('./http');
const proxy = require('./proxy');
const smoke = require('./smoke');
const wrapper = require('./wrapper');

module.exports = {
  error,
  ec2,
  event,
  fargate,
  http,
  proxy,
  smoke,
  wrapper,
};
