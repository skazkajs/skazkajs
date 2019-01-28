const debug = require('debug')('skazka:server:router');

const parser = require('url');
const pathToRegexp = require('path-to-regexp');

module.exports = class {
  constructor() {
    debug('Router created');

    this.routes = [];
    this.methods = [
      'HEAD',
      'OPTIONS',
      'GET',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ];

    this.methods.forEach((method) => {
      debug('Adding methods:');

      this[method.toLowerCase()] = (url) => {
        debug('%s %s', method.toUpperCase(), url);

        return this.catch({ method, url });
      };
    });

    this.del = this.delete;
  }

  all(url) {
    debug('Method: *');
    debug('Url:', url);

    return this.catch({ method: '*', url });
  }

  resolve() {
    debug('Router started');

    return (ctx) => {
      debug('Url:', ctx.get('req').url);

      return Promise.all(this.routes.map(route => route(ctx)))
        .then(() => debug('Router not found'))
        .catch(async (fn) => {
          debug('Router found');

          await fn(ctx);

          return Promise.reject();
        });
    };
  }

  catch({ method = '*', url = '/' } = {}) {
    debug('Rote registering...');

    debug('Method:', method);
    debug('Url:', url);

    const { routes } = this;
    const that = this;

    return {
      then(fn) {
        routes.push(async (ctx) => {
          if (method === '*' || ctx.get('req').method.toUpperCase() === method.toUpperCase()) {
            if (ctx.get('req').url === url) {
              debug('Router found');
              debug('%s: %s', ctx.get('req').method.toUpperCase(), url);

              const request = ctx.get('request');

              if (request) {
                request.set('query', {}).set('params', {});
              }

              return Promise.reject(fn);
            }

            const paramNames = [];
            const parsedUrl = parser.parse(ctx.get('req').url, true);
            const regexp = pathToRegexp(url, paramNames);

            if (regexp.test(parsedUrl.pathname)) {
              debug('Router found');
              debug('%s: %s', ctx.get('req').method.toUpperCase(), url);

              const { query } = parsedUrl;
              const params = {};

              const captures = parsedUrl.pathname.match(regexp).slice(1);
              for (let len = captures.length, i = 0; i < len; i += 1) {
                params[paramNames[i].name] = decodeURIComponent(captures[i]);
              }

              const request = ctx.get('request');

              if (request) {
                request.set('query', query).set('params', params);
              }

              return Promise.reject(fn);
            }
          }

          return Promise.resolve(ctx);
        });

        return that;
      },
    };
  }
};
