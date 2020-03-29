const { resolve } = require('path');

const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const index = require('@skazka/server-index');
const serv = require('@skazka/server-static');
const spa = require('@skazka/server-spa');

const server = new Server();

const root = resolve(__dirname, 'files');

server
  .then(init())
  .then(index({ root }))
  .then(serv({ root }))
  .then(spa({ root }));

module.exports = server;
