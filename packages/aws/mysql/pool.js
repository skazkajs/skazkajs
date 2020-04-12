const mysql = require('mysql2/promise');

const createPool = (options = {}) => mysql.createPool({
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
  ...options,
});

module.exports = createPool;
