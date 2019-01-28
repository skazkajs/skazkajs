const debug = require('debug')('skazka:server:pg:pool');

const { Pool } = require('pg');
const config = require('config');

debug('PostgreSQL config:', config.pg);

module.exports = new Pool(config.pg);
