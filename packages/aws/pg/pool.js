const { Pool } = require('pg');

const createPool = (options) => new Pool({
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 120000,
  ...options,
});

module.exports = createPool;
