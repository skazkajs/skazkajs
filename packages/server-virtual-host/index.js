const debug = require('debug')('skazka:server:virtual-host');

const ASTERISK_REGEXP = /\*/g;
const ASTERISK_REPLACE = '([^.]+)';
const ESCAPE_REGEXP = /([.+?^=!:${}()|[\]/\\])/g;
const ESCAPE_REPLACE = '\\$1';

const isRegexp = val => Object.prototype.toString.call(val) === '[object RegExp]';

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
    debug('Virtual host created!');

    this.domains = [];
    this.protocols = [
      'http',
      'https',
    ];

    this.protocols.forEach((protocol) => {
      this[protocol.toLowerCase()] = (domain) => {
        debug('%s %s', protocol, domain);
        return this.catch({ domain, protocol });
      };
    });
  }

  all(domain) {
    debug('* %s', domain);

    return this.catch({ domain, protocol: '*' });
  }

  resolve() {
    debug('VirtualHost started!');

    return ctx => Promise.all(this.domains.map(domain => domain(ctx)))
      .then(() => debug('Host not found!'))
      .catch(fn => fn(ctx));
  }

  catch({ domain = /.*/, protocol = '*' } = {}) {
    const { domains } = this;
    const that = this;

    return {
      then(fn) {
        domains.push(async (ctx) => {
          const requestProtocol = ctx.get('req').connection.encrypted ? 'https' : 'http';
          debug('Request protocol: %s', requestProtocol);

          const hostname = ctx.get('req').headers.host;
          debug('Hostname: %s', hostname);

          const regexp = getRegexp(domain);
          debug('Regexp: %s', regexp);

          const isProtocolMatched = (protocol === '*' || protocol === requestProtocol);
          debug('Is protocol matched: %s', isProtocolMatched);

          const isDomainMatched = !!regexp.exec(hostname);
          debug(regexp.exec(domain));
          debug('Is domain matched: %s', isDomainMatched);

          if (isProtocolMatched && isDomainMatched) {
            debug('Domain found!');
            debug('%s %s', domain, requestProtocol);

            return Promise.reject(fn);
          }
          return Promise.resolve(ctx);
        });

        return that;
      },
    };
  }
};
