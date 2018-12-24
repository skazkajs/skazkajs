const debug = require('debug')('skazka:server:graphql');

const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const {
  json,
  raw,
  text,
  urlencoded,
} = require('body-parser');

const setBody = (context) => {
  context.request = context.request || {}; // eslint-disable-line

  context.request.bosy = context.req.body; // eslint-disable-line
  delete context.req.body; // eslint-disable-line
};

exports.json = moduleBuilder(async (context, options = {}) => {
  debug('BodyParser json module created');
  debug('Options: %O', options);

  await express(context, json(options));

  return setBody(context);
});

exports.raw = moduleBuilder(async (context, options = {}) => {
  debug('BodyParser raw module created');
  debug('Options: %O', options);

  await express(context, raw(options));

  return setBody(context);
});

exports.text = moduleBuilder(async (context, options = {}) => {
  debug('BodyParser text module created');
  debug('Options: %O', options);

  await express(context, text(options));

  return setBody(context);
});

exports.urlencoded = moduleBuilder(async (context, options = {}) => {
  debug('BodyParser urlencoded module created');
  debug('Options: %O', options);

  await express(context, urlencoded(options));

  return setBody(context);
});
