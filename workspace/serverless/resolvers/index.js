const resolver = require('@skazka/aws/lambda/resolver');
const { timeout, retry } = require('@skazka/aws/helpers');

const users = require('../db');

const getUsers = resolver(
  timeout(retry(async (registry) => registry.users, { count: 3 }), 10),
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
  timeout(retry(async (registry, user) => {
    if (!user || !user.name) {
      throw new Error('Empty user!');
    }

    registry.users.push(user);

    return registry.users;
  }, { count: 3 }), 10),
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
