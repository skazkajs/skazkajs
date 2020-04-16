const {
  GraphQLObjectType,
  GraphQLList,
} = require('graphql');

const { UserType } = require('./types');
const { getUsers } = require('../../resolvers');

const query = new GraphQLObjectType({
  name: 'QueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return getUsers();
      },
    },
  },
});

module.exports = query;
