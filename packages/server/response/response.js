class Response {
  constructor(ctx) {
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
    if (!this.res.finished) {
      let res = await response;

      if (typeof res !== 'string') {
        res = JSON.stringify(res);
      }

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
    this.setHeader('Location', url);

    return this.send(url, code);
  }

  isFinished() {
    return this.res.finished;
  }
}

module.exports = Response;
