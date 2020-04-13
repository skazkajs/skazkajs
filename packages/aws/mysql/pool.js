const mysql = require('mysql2/promise');

const createPool = (options) => mysql.createPool({
  multipleStatements: true,
  connectTimeout: 120000,
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
  ...options,
});

module.exports = createPool;
