const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const cors = require('@skazka/server-cors');

const router = require('../router');

const server = new Server();

server
  .then(init({ error: { isJSON: true } }))
  .then(cors())
  .then(router.resolve());

module.exports = server;
