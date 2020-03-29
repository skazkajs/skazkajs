const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const graphql = require('@skazka/server-graphql');
const cors = require('@skazka/server-cors');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        },
      },
    },
  }),
});

const graphiql = true;

const server = new Server();

server
  .then(init())
  .then(cors())
  .then(graphql({ schema, graphiql }));


module.exports = server;
