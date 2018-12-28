const App = require('@skazka/server'); //  eslint-disable-line
const Router = require('@skazka/server-router'); //  eslint-disable-line
const error = require('@skazka/server-error'); //  eslint-disable-line
const srv = require('@skazka/server-http'); //  eslint-disable-line

const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');

const graphql = require('.');

const { host, axios } = global;

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

  test('It should test error with empty schema', async () => {
    app.then(graphql());

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(500);
      expect(response.statusText).toEqual('Internal Server Error');
      expect(response.data.errors[0].message).toEqual('GraphQL middleware options must contain a schema.');
    });
  });

  test('It should test error with empty query string', async () => {
    app.then(graphql({ schema }));

    await axios.get(host).catch(({ response }) => {
      expect(response.status).toEqual(400);
      expect(response.statusText).toEqual('Bad Request');
      expect(response.data.errors[0].message).toEqual('Must provide query string.');
    });
  });

  test('It should test middleware for GET request', async () => {
    app.then(graphql({
      schema,
    }));

    await axios.get(`${host}/?query={hello}`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
    });
  });

  test('It should test middleware for POST request', async () => {
    app.then(graphql({
      schema,
    }));

    await axios.post(host, { query: '{ hello }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
    });
  });

  test('It should test custom route', async () => {
    app.then(async (ctx) => {
      if (ctx.req.url === '/graphql') {
        return graphql({ schema })(ctx);
      }

      return app.resolve();
    });

    await axios.post(`${host}/graphql`, { query: '{ hello }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
    });
  });

  test('It should test yeps router for GET request', async () => {
    const router = new Router();

    router.get('/graphql').then(graphql({ schema }));

    app.then(router.resolve());

    await axios.get(`${host}/graphql?query={hello}`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
    });
  });

  test('It should test yeps router for POST request', async () => {
    const router = new Router();

    router.post('/graphql').then(graphql({ schema }));

    app.then(router.resolve());

    await axios.post(`${host}/graphql`, { query: '{ hello }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
    });
  });

  test('It should test graphiql with query', async () => {
    const graphiql = true;

    app.then(graphql({
      schema,
      graphiql,
    }));

    await axios.get(`${host}/?query={hello}`, { headers: { Accept: 'text/html' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('graphiql.min.js');
    });
  });

  test('It should test graphiql without query', async () => {
    const graphiql = true;

    app.then(graphql({
      schema,
      graphiql,
    }));

    await axios.get(host, { headers: { Accept: 'text/html' } }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('graphiql.min.js');
    });
  });
});
