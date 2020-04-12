const { Pool } = require('pg');

const createPool = (options = {}) => new Pool(options);

module.exports = createPool;
