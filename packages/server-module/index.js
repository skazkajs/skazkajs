const isCorrectContext = context => (!!context.req && !!context.res && !!context.app);

const hasContext = options => options.find(isCorrectContext);

const moduleBuilder = serverModule => (...options) => {
  if (hasContext(options)) {
    if (options[0] && !isCorrectContext(options[0])) {
      throw new Error('Context should be the first parameter!');
    }

    return serverModule(...options);
  }

  return (context) => {
    if (!isCorrectContext(context)) {
      throw new Error('Context should be the first parameter!');
    }

    return serverModule(context, ...options);
  };
};

module.exports = moduleBuilder;
