const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const helmet = require('helmet');

const helmetModule = moduleBuilder((context, options = {}) => express(context, helmet(options)));

Object.keys(helmet).forEach((key) => {
  helmetModule[key] = moduleBuilder((context, options = {}) => (
    express(context, helmet[key](options))
  ));
});

module.exports = helmetModule;
