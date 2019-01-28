const debug = require('debug')('skazka:server:redis:redis');

const Redis = require('ioredis');
const config = require('config');

debug('Redis config:', config.redis);

module.exports = new Redis(config.redis);
