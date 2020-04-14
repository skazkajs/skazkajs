const App = require('@skazka/server');

const init = require('@skazka/server-init');
const cors = require('@skazka/server-cors');

const router = require('../router');

const app = new App();

app
  .then(init({ error: { isJSON: true } }))
  .then(cors())
  .then(router.resolve());

module.exports = app;
