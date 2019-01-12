---
id: server-request
title: Server Request
sidebar_label: Server Request
---

Skazka Server Request.

## How to install

    npm i @skazka/server @skazka/server-request
    
With yarn:

    yarn add @skazka/server @skazka/server-request
    
Optionally you can add http server, error handler, logger and  response:

    npm i @skazka/server-http @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
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
  console.log(ctx.request);
  
  return ctx.response(ctx.request.url);
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```





