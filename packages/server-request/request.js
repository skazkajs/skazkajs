const debug = require('debug')('skazka:server:request:request');

class Request {
  constructor() {
    debug('Request created');
  }

  get(name) {
    return this[name];
  }

  set(name, value, rewrite = false) {
    if (this[name] && !rewrite) {
      throw new Error(`Value for ${name} already set!`);
    }

    this[name] = value;

    return this;
  }
}

module.exports = Request;
