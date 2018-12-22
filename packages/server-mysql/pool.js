const debug = require('debug')('skazka:server:mysql:pool');

const mysql = require('promise-mysql');
const config = require('config');

debug('MySQL config:', config.mysql);

module.exports = mysql.createPool(config.mysql);
