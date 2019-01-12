---
id: server-graphql
title: Server GraphQL
sidebar_label: Server GraphQL
---

Express GraphQL for Skazka Server.

## How to install

    npm i @skazka/server @skazka/server-graphql graphql
    
With yarn:

    yarn add @skazka/server @skazka/server-graphql graphql
    
Optionally you can add http server, error handler, logger and router:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const graphql = require('@skazka/server-graphql');

const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const server = require('@skazka/server-http');

const { 
  GraphQLSchema, 
  GraphQLObjectType, 
  GraphQLString,
} = require('graphql');

const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
]);

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

// for each request
app.then(graphql({ schema }));
  
// for url
router.get('/graphql').then(graphql({ schema }));
app.then(router.resolve());
        
server.createHttpServer(app);
```

To configure Skazka Server GraphQL you can read docs from **[express-graphql](https://github.com/graphql/express-graphql)**.
