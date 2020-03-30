const express = require('@skazka/server-express');
const moduleBuilder = require('@skazka/server-module');

const cors = require('cors');

module.exports = moduleBuilder((context, options = {}) => express(context, cors(options)));
