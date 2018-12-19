const debug = require('debug')('skazka:server:core');

const core = async (ctx, modules, index = 0) => {
  const module = modules[index];

  if (module) {
    debug('Index:', index);
    debug(module.toString());

    await module(ctx);

    return core(ctx, modules, index + 1);
  }

  return Promise.resolve(ctx);
};

module.exports = core;
