const chai = require('chai'); //  eslint-disable-line
const dirtyChai = require('dirty-chai'); //  eslint-disable-line
const sinon = require('sinon'); //  eslint-disable-line

const axios = require('axios'); // eslint-disable-line
const httpAdapter = require('axios/lib/adapters/http'); // eslint-disable-line

const host = `http://localhost:${process.env.PORT || '3000'}`;
const hostSSL = `https://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

chai.use(dirtyChai);

const { expect } = chai;

module.exports = {
  host,
  hostSSL,
  axios,
  chai,
  expect,
  sinon,
};
