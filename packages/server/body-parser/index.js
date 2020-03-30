const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const {
  json,
  raw,
  text,
  urlencoded,
} = require('body-parser');

const setBody = (context) => {
  const { body } = context.req;

  const request = context.get('request');

  if (request) {
    request.set('body', body);
  }

  return body;
};

exports.json = moduleBuilder(async (context, options = {}) => {
  await express(context, json(options));

  return setBody(context);
});

exports.raw = moduleBuilder(async (context, options = {}) => {
  await express(context, raw(options));

  return setBody(context);
});

exports.text = moduleBuilder(async (context, options = {}) => {
  await express(context, text(options));

  return setBody(context);
});

exports.urlencoded = moduleBuilder(async (context, options) => {
  await express(context, urlencoded(options));

  return setBody(context);
});
