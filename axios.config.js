const axios = require('axios'); // eslint-disable-line
const httpAdapter = require('axios/lib/adapters/http'); // eslint-disable-line

const host = `http://localhost:${process.env.PORT || '3000'}`;
const hostSSL = `https://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

global.host = host;
global.axios = axios;
global.hostSSL = hostSSL;
