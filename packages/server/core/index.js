const core = async (ctx, modules, index = 0) => {
  const module = modules[index];

  if (module) {
    await module(ctx);

    return core(ctx, modules, index + 1);
  }

  return Promise.resolve(ctx);
};

module.exports = core;
