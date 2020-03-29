const debug = require('debug')('skazka:server:module');

const Context = require('@skazka/server-context');

const isCorrectContext = (context) => context instanceof Context;

const hasContext = (options) => options.find(isCorrectContext);

const moduleBuilder = (serverModule) => (...options) => {
  debug('Creating a new module...');

  if (hasContext(options)) {
    debug('All parameters are set.');

    if (options[0] && !isCorrectContext(options[0])) {
      throw new Error('Context should be the first parameter!');
    }

    return serverModule(...options);
  }

  return (context) => {
    debug('Setting context...');

    if (!isCorrectContext(context)) {
      throw new Error('Context should be the first parameter!');
    }

    return serverModule(context, ...options);
  };
};

module.exports = moduleBuilder;
