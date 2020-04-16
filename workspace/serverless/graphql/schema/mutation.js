const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const { UserType } = require('./types');
const { createUser } = require('../../resolvers');

const mutation = new GraphQLObjectType({
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
        return createUser({ name });
      },
    },
  },
});

module.exports = mutation;
