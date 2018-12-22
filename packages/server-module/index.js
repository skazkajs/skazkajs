const isCorrectContext = context => (!!context.req && !!context.res && !!context.app);

const moduleBuilder = serverModule => (...options) => {
  if (options.length === serverModule.length) {
    if (options[0] && !isCorrectContext(options[0])) {
      throw new Error('Context should be the first parameter!');
    }

    return serverModule(...options);
  }

  return context => serverModule(context, ...options);
};

module.exports = moduleBuilder;
