const http = require('@skazka/aws/lambda/http');

const app = require('./app');

module.exports.handler = http(app);
