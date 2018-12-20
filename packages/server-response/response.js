const debug = require('debug')('skazka:server:response:response');

const { STATUS_CODES } = require('http');

debug('Response created');

class Response {
  constructor(ctx) {
    debug('Response object created');

    this.ctx = ctx;
  }

  async resolve(data = '') {
    debug('Response resolve');
    debug('Response data:');
    debug(data);

    debug('Response finished:', this.ctx.res.finished);

    if (!this.ctx.res.finished) {
      debug('Response sending');

      let res = await data;

      if (data instanceof Error) {
        throw data;
      }

      debug('Type:', typeof res);

      if (typeof res !== 'string') {
        res = JSON.stringify(res);
      }

      debug('Finishing...');
      this.ctx.res.end(res);
    }

    return Promise.reject();
  }

  async reject(data) {
    debug('Response reject');

    let res;

    try {
      debug('Getting data');
      res = await this.resolve(data);
    } catch (err) {
      debug('Response error:');
      debug(err);

      const code = err.code || 500;
      debug('Response code:', code);

      const message = err.message || STATUS_CODES[500];
      debug('Response message:', message);

      res = message;
      this.ctx.res.statusCode = code;
    }

    debug('Response finishing...');
    this.ctx.res.end(res);

    return Promise.reject();
  }

  async redirect(url = '/', code = 301) {
    debug('Response redirect');

    debug('Response url:', url);
    debug('Response code:', code);

    this.ctx.res.statusCode = code;
    this.ctx.res.setHeader('Location', url);

    return this.resolve();
  }
}

module.exports = Response;
