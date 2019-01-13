---
id: graphql
title: Server GraphQL
sidebar_label: GraphQL
---

This example shows how to use GraphQL with CORS packages.

## How to install

    npm i @skazka/server @skazka/server-init @skazka/server-graphql @skazka/server-cors @skazka/server-http debug graphql axios jest
    
With yarn:

    yarn add @skazka/server @skazka/server-init @skazka/server-graphql @skazka/server-cors @skazka/server-http debug graphql axios jest
    
## How to use

### index.js

```javascript
const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const graphql = require('@skazka/server-graphql');
const cors = require('@skazka/server-cors');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

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

const graphiql = true;

const server = new Server();

server
  .then(init())
  .then(cors())
  .then(graphql({ schema, graphiql }));


module.exports = server;
```

### bin/www

```
#!/usr/bin/env node

const server = require('@skazka/server-http');
const app = require('..');

server.createHttpServer(app);
```

### index.test.js

```javascript
const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('.');

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

  test('It should test GET request', async () => {
    await axios.get(`${host}/?query={hello}`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
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

  test('It should test POST request', async () => {
    await axios.post(host, { query: '{ hello }' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.data.hello).toEqual('world');
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
});
```

### package.json

```json
{
  "name": "example-graphql",
  "version": "0.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "node bin/www",
    "test": "PORT=7000 jest  --coverage --runInBand"
  },
  "keywords": [
    "graphql",
    "node.js",
    "skazka",
    "cors"
  ],
  "author": "skazkajs",
  "license": "MIT",
  "dependencies": {
    "@skazka/server": ">=0.0.0",
    "@skazka/server-cors": ">=0.0.0",
    "@skazka/server-graphql": ">=0.0.0",
    "@skazka/server-http": ">=0.0.0",
    "@skazka/server-init": ">=0.0.0",
    "axios": ">=0.18.0",
    "debug": ">=4.0.0",
    "graphql": ">=14.0.0",
    "jest": ">=23.6.0"
  }
}
```

## Commands

### Run app

    npm start
    
Or

    yarn start
    
And result:

![Result](https://skazkajs.org/img/graphql.png)
    
### Test app

    npm test
    
Or

    yarn test

## More docs

- [Server](https://skazkajs.org/server)
- [Server init](https://skazkajs.org/server/init)
- [Server GraphQL](https://skazkajs.org/server/graphql)
- [Server CORS](https://skazkajs.org/server/cors)
- [Server HTTPS(S)](https://skazkajs.org/server/http)
- [GraphQL.js](https://www.npmjs.com/package/graphql)

## Copy from git

Clone:

    git clone https://github.com/skazkajs/skazka.git
    cd skazka/examples/graphql

Install:
    
    npm i

Or 

    yarn
    
And run **start** or **test** [commands](#commands).
