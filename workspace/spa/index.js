const { resolve } = require('path');

const App = require('@skazka/server');

const init = require('@skazka/server-init');
const index = require('@skazka/server-index');
const serv = require('@skazka/server-static');
const spa = require('@skazka/server-spa');

const app = new App();

const root = resolve(__dirname, 'files');

app
  .then(init())
  .then(index({ root }))
  .then(serv({ root }))
  .then(spa({ root }));

module.exports = app;
