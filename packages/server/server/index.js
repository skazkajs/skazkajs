const core = require('@skazka/server-core');
const Context = require('@skazka/server-context');

class Server {
  constructor() {
    this.modules = [];
    this.error = [];
  }

  then(fn) {
    this.modules.push(fn);

    return this;
  }

  catch(fn) {
    this.error.push(fn);

    return this;
  }

  reject(message) { // eslint-disable-line
    return Promise.reject(message);
  }

  resolve() {
    return async (req, res) => {
      const context = (new Context())
        .set('server', this)
        .set('req', req)
        .set('res', res);

      try {
        await core(context, this.modules);
      } catch (error) {
        if (error) {
          await Promise.all(this.error.map((fn) => fn(error, context)));
        }
      }
    };
  }

  all(fns) {
    this.modules.push(async (ctx) => {
      await Promise.all(fns.map((fn) => fn(ctx)));
    });

    return this;
  }

  race(fns) {
    this.modules.push(async (ctx) => {
      await Promise.race(fns.map((fn) => fn(ctx)));
    });

    return this;
  }
}

module.exports = Server;
