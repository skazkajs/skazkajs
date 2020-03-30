# Server Serverless example

This example shows how to create GraphQL and REST APIs using Serverless.

## How to install

    npm i @skazka/server @skazka/server-body-parser @skazka/server-cors @skazka/server-graphql @skazka/server-http @skazka/server-init @skazka/server-router aws-serverless-express serverless serverless-offline graphql axios mocha chai sinon
    
With yarn:

    yarn add @skazka/server @skazka/server-body-parser @skazka/server-cors @skazka/server-graphql @skazka/server-http @skazka/server-init @skazka/server-router aws-serverless-express serverless serverless-offline graphql axios mocha chai sinon
    
## How to use

### db/index.js

It's emulation of any database.

```javascript
const users = [];

module.exports = users;
```

### graphql/index.js

```javascript
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const users = require('../db');

const UserType = new GraphQLObjectType({
  name: 'UserType',
  description: 'User type',
  fields: {
    name: {
      type: GraphQLString,
    },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryType',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve() {
          return users;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
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
          users.push({ name });

          return users;
        },
      },
    },
  }),
});

const graphiql = true;

module.exports = { schema, graphiql };
```

### router/index.js

```javascript
const Router = require('@skazka/server-router');

const graphql = require('@skazka/server-graphql');
const bodyParser = require('@skazka/server-body-parser');

const { schema, graphiql } = require('../graphql');
const users = require('../db');

const router = new Router();

router.all('/').then(graphql({ schema, graphiql }));

router.get('/users').then(ctx => ctx.response(users));

router.post('/users').then(async (ctx) => {
  await bodyParser.json(ctx);

  users.push(ctx.request.body);

  return ctx.response({ message: 'User saved' });
});

module.exports = router;
```

### app/index.js

```javascript
const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const cors = require('@skazka/server-cors');

const router = require('../router');

const server = new Server();

server
  .then(init({ error: { isJSON: true } }))
  .then(cors())
  .then(router.resolve());

module.exports = server;
```

### index.test.js

```javascript
const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('./app');

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('GraphQL example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test GET graphql request', async () => {
    await axios.get(`${host}/?query={ users { name } }`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users).toEqual([]);
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });
  });

  test('It should test POST graphql request', async () => {
    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users).toEqual([]);
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });
  });

  test('It should test GET /users', async () => {
    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual([]);
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test POST /users', async () => {
    await axios.post(`${host}/users`, { name: 'test' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.message).toEqual('User saved');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data[0].name).toEqual('test');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });
  });

  test('It should test POST graphql request to add data', async () => {
    await axios.post(`${host}/`, {
      query: `
      mutation getUsers {
        users(name: "test") {
          name
        }
       }
       `,
    }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });

    await axios.post(`${host}/`, { query: '{ users { name } }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.users[0].name).toEqual('test');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json; charset=utf-8');
    });

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data[0].name).toEqual('test');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });
});
```

### package.json

```json
{
  "name": "example-serverless",
  "version": "0.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "node bin/www",
    "test": "PORT=7000 mocha **/*.test.js",
    "serverless": "sls offline start",
    "deploy": "sls deploy",
    "remove": "sls remove"
  },
  "keywords": [
    "graphql",
    "node.js",
    "skazka",
    "cors",
    "serverless"
  ],
  "author": "skazkajs",
  "license": "MIT",
  "dependencies": {
    "@skazka/server": ">=0.0.0",
    "@skazka/server-body-parser": ">=0.0.0",
    "@skazka/server-cors": ">=0.0.0",
    "@skazka/server-graphql": ">=0.0.0",
    "@skazka/server-http": ">=0.0.0",
    "@skazka/server-init": ">=0.0.0",
    "@skazka/server-router": ">=0.0.0",
    "aws-serverless-express": ">=3.3.5",
    "axios": ">=0.18.0",
    "graphql": ">=14.0.0",
    "serverless": ">=1.36.1",
    "serverless-offline": ">=3.33.0"
  }
}
```

### bin/www

```
#!/usr/bin/env node

const server = require('@skazka/server-http');
const app = require('../app');

server.createHttpServer(app);
```

### index.js

```javascript
const awsServerlessExpress = require('aws-serverless-express');

const app = require('./app');

module.exports.handler = (event, context) => awsServerlessExpress.proxy(
  awsServerlessExpress.createServer(app.resolve()),
  event,
  context,
);
```

### serverless.yml

```yaml
service: serverless-example

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: eu-central-1

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'

```

## Commands

### Run app

    npm start
    
Or

    yarn start

### Test app

    npm test
    
Or

    yarn test

### Run app using serverless

    npm run serverless
    
Or

    yarn serverless

### Run app using AWS lambda

    npm run deploy
    
Or

    yarn deploy

### Clear AWS lambda

    npm run remove
    
Or

    yarn remove    
    
## More docs

- [Server](https://skazkajs.org/server)
- [Server init](https://skazkajs.org/server/init)
- [Server GraphQL](https://skazkajs.org/server/graphql)
- [Server Router](https://skazkajs.org/server/router)
- [Server Body Parser](https://skazkajs.org/server/body-parser)
- [Server CORS](https://skazkajs.org/server/cors)
- [Server HTTPS(S)](https://skazkajs.org/server/http)
- [GraphQL.js](https://www.npmjs.com/package/graphql)
- [Serverless](https://serverless.com/)
- [Serverless offline](https://www.npmjs.com/package/serverless-offline)
- [AWS Serverless Express](https://www.npmjs.com/package/aws-serverless-express)
- [AWS - Credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

## Copy from git

Clone:

    git clone https://github.com/skazkajs/skazka.git
    cd skazka/examples/serverless

Install:
    
    npm i

Or 

    yarn
    
And run **start**, **test**, **serverless**, **deploy** or **remove** [commands](#commands).
