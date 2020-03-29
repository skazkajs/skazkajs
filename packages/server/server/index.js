const debug = require('debug')('skazka:server:server');

const core = require('@skazka/server-core');
const Context = require('@skazka/server-context');

class Server {
  constructor() {
    debug('Server created');

    this.modules = [];
    this.error = [];
  }

  then(fn) {
    debug('New module added');

    this.modules.push(fn);

    return this;
  }

  catch(fn) {
    debug('Error handler added');

    this.error.push(fn);

    return this;
  }

  reject(message) { // eslint-disable-line
    debug('Server reject');

    return Promise.reject(message);
  }

  resolve() {
    debug('Server started');

    return async (req, res) => {
      debug('Request event started');

      const context = (new Context())
        .set('server', this)
        .set('req', req)
        .set('res', res);

      try {
        await core(context, this.modules);
        debug('Modules length:', this.modules.length);
      } catch (error) {
        debug('Error:', error);

        if (error) {
          debug('Running error handler');

          await Promise.all(this.error.map((fn) => fn(error, context)));
        }
      }
      debug('Request event finished');
    };
  }

  all(fns) {
    debug('Server all');

    this.modules.push(async (ctx) => {
      await Promise.all(fns.map((fn) => fn(ctx)));
    });

    return this;
  }

  race(fns) {
    debug('Server race');

    this.modules.push(async (ctx) => {
      await Promise.race(fns.map((fn) => fn(ctx)));
    });

    return this;
  }
}

module.exports = Server;
