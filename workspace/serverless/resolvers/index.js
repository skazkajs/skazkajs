const {
  compose,
  resolver,
  retry,
  timeout,
} = require('@skazka/aws/handler');

const users = require('../db');

const handler = compose(
  resolver(null, {
    useRegistry: async (registry) => {
      registry.users = users; // eslint-disable-line

      return async () => {
        delete registry.users; // eslint-disable-line
      };
    },
  }),
  timeout(null, { seconds: 10 }),
  retry(null, { count: 3 }),
);

const getUsers = handler(async (registry) => registry.users);

const createUser = handler(async (registry, user) => {
  if (!user || !user.name) {
    throw new Error('Empty user!');
  }

  registry.users.push(user);

  return registry.users;
});


module.exports = {
  getUsers,
  createUser,
};
