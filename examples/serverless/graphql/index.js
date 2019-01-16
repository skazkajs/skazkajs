const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const users = require('../db');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'User type',
  fields: {
    name: {
      type: GraphQLString,
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryType',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve() {
          return users;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'MutationType',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        args: {
          name: {
            type: GraphQLString,
          },
        },
        resolve(parent, { name }) {
          users.push({ name });

          return users;
        },
      },
    },
  }),
});

const graphiql = true;

module.exports = { schema, graphiql };
