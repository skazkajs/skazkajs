const graphql = require('@skazka/server-graphql');

const schema = require('./schema');

module.exports = graphql({ schema, graphiql: true });
