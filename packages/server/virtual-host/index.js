const ASTERISK_REGEXP = /\*/g;
const ASTERISK_REPLACE = '([^.]+)';
const ESCAPE_REGEXP = /([.+?^=!:${}()|[\]/\\])/g;
const ESCAPE_REPLACE = '\\$1';

const isRegexp = (val) => Object.prototype.toString.call(val) === '[object RegExp]';

const getRegexp = (val) => {
  const source = !isRegexp(val)
    ? String(val)
      .replace(ESCAPE_REGEXP, ESCAPE_REPLACE)
      .replace(ASTERISK_REGEXP, ASTERISK_REPLACE)
    : val.source;

  return new RegExp(`^${source}$`, 'i');
};

module.exports = class {
  constructor() {
    this.domains = [];
    this.protocols = [
      'http',
      'https',
    ];

    this.protocols.forEach((protocol) => {
      this[protocol.toLowerCase()] = (domain) => this.catch({ domain, protocol });
    });
  }

  all(domain) {
    return this.catch({ domain, protocol: '*' });
  }

  resolve() {
    return (ctx) => Promise.all(this.domains.map((domain) => domain(ctx))).catch((fn) => fn(ctx));
  }

  catch({ domain = /.*/, protocol = '*' } = {}) {
    const { domains } = this;
    const that = this;

    return {
      then(fn) {
        domains.push(async (ctx) => {
          const requestProtocol = ctx.get('req').connection.encrypted ? 'https' : 'http';

          const hostname = ctx.get('req').headers.host;

          const regexp = getRegexp(domain);

          const isProtocolMatched = (protocol === '*' || protocol === requestProtocol);

          const isDomainMatched = !!regexp.exec(hostname);

          if (isProtocolMatched && isDomainMatched) {
            return Promise.reject(fn);
          }

          return Promise.resolve(ctx);
        });

        return that;
      },
    };
  }
};
