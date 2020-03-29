const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const { expect, axios, host } = require('../../../test.config');

const graphql = require('.');

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

describe('Server graphql test', async () => {
  let app;
  let server;

  beforeEach(() => {
    app = new App();
    app.all([
      error(),
    ]);
    server = srv.createHttpServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('It should test error with empty schema', async () => {
    app.then(graphql());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(500);
      expect(response.statusText).equal('Internal Server Error');
      expect(response.data.errors[0].message).equal('GraphQL middleware options must contain a schema.');
    });
  });

  it('It should test error with empty query string', async () => {
    app.then(graphql({ schema }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).equal(400);
      expect(response.statusText).equal('Bad Request');
      expect(response.data.errors[0].message).equal('Must provide query string.');
    });
  });

  it('It should test middleware for GET request', async () => {
    app.then(graphql({
      schema,
    }));

    await axios.get(`${host}/?query={hello}`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
    });
  });

  it('It should test middleware for POST request', async () => {
    app.then(graphql({
      schema,
    }));

    await axios.post(host, { query: '{ hello }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
    });
  });

  it('It should test custom route', async () => {
    app.then(async (ctx) => {
      if (ctx.get('req').url === '/graphql') {
        return graphql({ schema })(ctx);
      }

      return app.resolve();
    });

    await axios.post(`${host}/graphql`, { query: '{ hello }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
    });
  });

  it('It should test yeps router for GET request', async () => {
    const router = new Router();

    router.get('/graphql').then(graphql({ schema }));

    app.then(router.resolve());

    await axios.get(`${host}/graphql?query={hello}`).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
    });
  });

  it('It should test yeps router for POST request', async () => {
    const router = new Router();

    router.post('/graphql').then(graphql({ schema }));

    app.then(router.resolve());

    await axios.post(`${host}/graphql`, { query: '{ hello }' }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data.data.hello).equal('world');
    });
  });

  it('It should test graphiql with query', async () => {
    const graphiql = true;

    app.then(graphql({
      schema,
      graphiql,
    }));

    await axios.get(`${host}/?query={hello}`, { headers: { Accept: 'text/html' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('graphiql.min.js');
    });
  });

  it('It should test graphiql without query', async () => {
    const graphiql = true;

    app.then(graphql({
      schema,
      graphiql,
    }));

    await axios.get(host, { headers: { Accept: 'text/html' } }).then((response) => {
      expect(response.status).equal(200);
      expect(response.statusText).equal('OK');
      expect(response.data).contain('graphiql.min.js');
    });
  });
});
