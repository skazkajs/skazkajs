const Server = require('@skazka/server');
const Router = require('@skazka/server-router');

const init = require('@skazka/server-init');
const bodyParser = require('@skazka/server-body-parser');
const cors = require('@skazka/server-cors');

const server = new Server();
const router = new Router();

const users = [];

server
  .then(init({ error: { isJSON: true } }))
  .then(cors());

router.get('/').then((ctx) => ctx.redirect('/users'));

router.get('/users').then((ctx) => ctx.response(users));

router.post('/users').then(async (ctx) => {
  await bodyParser.json(ctx);

  users.push(ctx.request.body);

  return ctx.response({ message: 'User saved' });
});

server.then(router.resolve());

module.exports = server;
