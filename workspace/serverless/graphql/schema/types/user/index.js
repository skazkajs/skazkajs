const { GraphQLObjectType, GraphQLString } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'User type',
  fields: {
    name: {
      type: GraphQLString,
    },
  },
});

module.exports = UserType;
