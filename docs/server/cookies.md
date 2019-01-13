---
id: cookies
title: Server Cookies Parser
sidebar_label: Server Cookies Parser
---

Parse **Cookie** header and populate **ctx.request.cookies** with an object keyed by the cookie names. 

## How to install

    npm i @skazka/server @skazka/server-cookies @skazka/server-request

With yarn:

    yarn add @skazka/server @skazka/server-cookies @skazka/server-request

Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const cookies = require('@skazka/server-cookies');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request');
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  request(),
  cookies(),
  response(),
]);

app.then(async (ctx) => {
  // it works for each request
  console.log(ctx.request.cookies);
});

router.get('/data').then(async (ctx) => {
  return ctx.response('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

Or you can get cookies for one route:

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const cookies = require('@skazka/server-cookies');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request');
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  request(),
  response(),
]);

router.get('/data').then(async (ctx) => {
  const cookiesObject = await cookies(ctx);
  
  return ctx.response(cookiesObject); 
  
  // Or
 // return ctx.response(ctx.request.cookies); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```
