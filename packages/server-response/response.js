const debug = require('debug')('skazka:server:response:response');

debug('Response created');

class Response {
  constructor(ctx) {
    debug('Response object created');

    this.res = ctx.get('res');

    if (!this.res) {
      throw new Error('Response should be set!');
    }
  }

  setHeader(name, value) {
    this.res.setHeader(name, value);

    return this;
  }

  async sendJSON(response = '', code = 200) {
    return this.send(response, code, 'application/json');
  }

  async send(response = '', code = 200, contentType = null) {
    debug('Response resolve');

    debug('Response', response);
    debug('Code', code);
    debug('Content-Type', contentType);

    debug('Response finished:', this.res.finished);

    if (!this.res.finished) {
      debug('Response sending');

      let res = await response;

      debug('Type:', typeof res);

      if (typeof res !== 'string') {
        res = JSON.stringify(res);
      }

      debug('Finishing...');
      debug('Response:', res);

      if (contentType) {
        this.setHeader('Content-Type', contentType);
      }

      if (!this.res.getHeader('Content-Type')) {
        this.setHeader('Content-Type', 'text/plain');
      }

      this.res.statusCode = code;
      this.res.end(res);
    }

    return Promise.reject();
  }

  async redirect(url = '/', code = 301) {
    debug('Response redirect');

    debug('Response url:', url);
    debug('Response code:', code);

    this.setHeader('Location', url);

    return this.send(url, code);
  }

  isFinished() {
    return this.res.finished;
  }
}

module.exports = Response;
