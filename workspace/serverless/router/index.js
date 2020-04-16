const Router = require('@skazka/server-router');
const bodyParser = require('@skazka/server-body-parser');

const graphql = require('../graphql');
const { getUsers, createUser } = require('../resolvers');

const router = new Router();

router.all('/').then(graphql);

router.get('/users').then((ctx) => ctx.response(getUsers()));

router.post('/users').then(async (ctx) => {
  await bodyParser.json(ctx);

  return ctx.response(createUser(ctx.request.body));
});

module.exports = router;
