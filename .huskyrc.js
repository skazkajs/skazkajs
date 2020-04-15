module.exports = {
  hooks: {
    "pre-commit": "yarn test:db:stop && yarn test",
    "pre-push": "yarn test:db:stop && yarn test",
  },
};
