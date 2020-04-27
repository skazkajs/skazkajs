const { expect, sinon } = require('../../../test.config');

const resolver = require('./resolver');

const compose = require('./compose');

describe('Handler resolver test', () => {
  it('It should test resolver', async () => {
    const users = [];

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
      },
    );

    expect(await getUsers()).to.be.eql([]);
    expect(await createUser({ name: 'test1' })).to.be.eql([{ name: 'test1' }]);
    expect(await getUsers()).to.be.eql([{ name: 'test1' }]);
    expect(await createUser({ name: 'test2' })).to.be.eql([{ name: 'test1' }, { name: 'test2' }]);
    expect(await getUsers()).to.be.eql([{ name: 'test1' }, { name: 'test2' }]);
  });

  it('It should test resolver without options', async () => {
    const handler = resolver(
      async () => 123,
    );

    expect(await handler()).to.be.eql(123);
  });

  it('It should test resolver with compose', async () => {
    const spy = sinon.spy();

    const wrapper = compose(
      resolver(),
    );

    const handler = wrapper((registry, param) => {
      expect(registry).to.be.eql({});
      expect(param).to.be.equal(1);

      spy();
    });

    await handler(1);

    expect(spy.called).is.true();
  });
});
