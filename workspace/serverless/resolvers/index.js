const resolver = require('@skazka/aws/lambda/resolver');

const users = require('../db');

const getUsers = resolver(
  async (registry) => registry.users,
  {
    useRegistry: async (registry) => {
      registry.users = users; // eslint-disable-line

      return async () => {
        delete registry.users; // eslint-disable-line
      };
    },
  },
);

const createUser = resolver(
  async (registry, user) => {
    if (!user || !user.name) {
      throw new Error('Empty user!');
    }

    registry.users.push(user);

    return registry.users;
  },
  {
    useRegistry: async (registry) => {
      registry.users = users; // eslint-disable-line

      return async () => {
        delete registry.users; // eslint-disable-line
      };
    },
    errorHandlerExceptions: ['Empty user!'],
  },
);


module.exports = {
  getUsers,
  createUser,
};
