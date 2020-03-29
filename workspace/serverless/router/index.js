const Router = require('@skazka/server-router');

const graphql = require('@skazka/server-graphql');
const bodyParser = require('@skazka/server-body-parser');

const { schema, graphiql } = require('../graphql');
const users = require('../db');

const router = new Router();

router.all('/').then(graphql({ schema, graphiql }));

router.get('/users').then((ctx) => ctx.response(users));

router.post('/users').then(async (ctx) => {
  await bodyParser.json(ctx);

  users.push(ctx.request.body);

  return ctx.response({ message: 'User saved' });
});

module.exports = router;
