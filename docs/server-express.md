---
id: server-express
title: Server Express Wrapper
sidebar_label: Server Express Wrapper
---
Skazka Server Express wrapper helps to use any Express.js middlawere.

## How to install

    npm i @skazka/server @skazka/server-express
    
With yarn:

    yarn add @skazka/server @skazka/server-express
    
Optionally you can add http server, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');

const express = require('@skazka/server-express');
const { json } = require('body-parser');

const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  response(),
  express(json()), // works for each next module
]);
    
app.then(async (ctx) => {
  // code for each request
  await express(ctx, json()); // works for each next module
});
    
router.get('/data').then(async (ctx) => {
  await express(ctx, json()); // works only for this route
  
  return ctx.response(ctx.req.body); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

### Examples

```javascript
app.all([
  ...
  express(middleware(options)),
  ...
]);
```

```javascript
app.then(express(middleware(options)));
```

```javascript
app.then(async (context) => {
  await express(context, middleware(options));
})
```

```javascript
app.then(async (context) => {
  await express(middleware(options))(context);
})
