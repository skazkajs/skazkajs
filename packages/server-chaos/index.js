const debug = require('debug')('skazka:server:chaos');

const config = require('config');
const pause = require('promise-pause-timeout');
const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

debug('Chaos module created');

module.exports = moduleBuilder(async (context) => {
  debug('Chaos request');

  const enabled = !!config.chaos.enabled;
  debug('Enabled:', enabled);

  if (enabled) {
    context.get('res').setHeader('X-Chaos', 1);

    const timeoutProbability = parseFloat(config.chaos.timeout.probability);
    debug('Timeout probability:', timeoutProbability);

    if (Math.random() <= timeoutProbability) {
      debug('Chaos timeout is working...');

      const time = parseInt(config.chaos.timeout.time, 10);
      debug('Time:', time);

      context.get('res').setHeader('X-Chaos-Timeout', time);

      await pause(time * 1000);
    }

    const errorProbability = parseFloat(config.chaos.error.probability);
    debug('Error probability:', errorProbability);

    if (Math.random() <= errorProbability) {
      debug('Chaos error is working...');

      context.get('res').setHeader('X-Chaos-Error', 1);

      const response = new Response(context);

      return response.send('Chaos', 500);
    }
  }

  return Promise.resolve();
});
