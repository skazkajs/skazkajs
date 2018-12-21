const debug = require('debug')('skazka:server:chaos:index');

const config = require('config');
const Response = require('@skazka/server-response/response');

const { timeout, error } = require('./chaos');

debug('Chaos module created');

module.exports = () => async (ctx) => {
  debug('Chaos request');

  const enabled = !!config.chaos.enabled;
  debug('Enabled:', enabled);

  if (enabled) {
    ctx.res.setHeader('X-Chaos', 1);

    const timeoutProbability = parseFloat(config.chaos.timeout.probability);
    debug('Timeout probability:', timeoutProbability);

    if (Math.random() <= timeoutProbability) {
      debug('Chaos timeout is working...');

      const time = parseInt(config.chaos.timeout.time, 10);
      debug('Time:', time);

      ctx.res.setHeader('X-Chaos-Timeout', time);

      await timeout(time);
    }

    const errorProbability = parseFloat(config.chaos.error.probability);
    debug('Error probability:', errorProbability);

    if (Math.random() <= errorProbability) {
      debug('Chaos error is working...');

      ctx.res.setHeader('X-Chaos-Error', 1);

      const response = new Response(ctx);

      return response.reject(error());
    }
  }

  return Promise.resolve();
};
