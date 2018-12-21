const debug = require('debug')('skazka:server:chaos:chaos');

const pause = require('promise-pause-timeout');

debug('Chaos kernel created');

const timeout = delay => pause(delay * 1000);

const error = () => Promise.reject(new Error('Chaos'));

module.exports = { timeout, error };
