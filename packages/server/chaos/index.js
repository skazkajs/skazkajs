const config = require('config');
const pause = require('promise-pause-timeout');
const moduleBuilder = require('@skazka/server-module');
const Response = require('@skazka/server-response/response');

module.exports = moduleBuilder(async (context) => {
  const enabled = !!config.chaos.enabled;

  if (enabled) {
    context.get('res').setHeader('X-Chaos', 1);

    const timeoutProbability = parseFloat(config.chaos.timeout.probability);

    if (Math.random() <= timeoutProbability) {
      const time = parseInt(config.chaos.timeout.time, 10);

      context.get('res').setHeader('X-Chaos-Timeout', time);

      await pause(time * 1000);
    }

    const errorProbability = parseFloat(config.chaos.error.probability);

    if (Math.random() <= errorProbability) {
      context.get('res').setHeader('X-Chaos-Error', 1);

      const response = new Response(context);

      return response.send('Chaos', 500);
    }
  }

  return Promise.resolve();
});
