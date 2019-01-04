# Server response

Skazka Server response.

[![NPM](https://nodei.co/npm/@skazka/server-pg.png)](https://npmjs.org/package/@skazka/server-pg)

## How to install

    npm i @skazka/server @skazka/server-response
    
With yarn:

    yarn add @skazka/server @skazka/server-response
    
Optionally you can add http server, error handler, logger and router:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  response(),
]);
    
app.then(async (ctx) => {
  // it works for each request
  // it stops all other modules
  return ctx.response.resolve('data'); 
});
    
router.get('/data').then(async (ctx) => {
  // it works only for this route
  return ctx.response.resolve('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

### Without response

```javascript
app.then(async (ctx) => {
  ctx.res.statusCode = 200;
  ctx.res.end('data');
      
  return Promise.reject();
});

router.get('/data').then(async (ctx) => {
  ctx.res.statusCode = 200;
  ctx.res.end('data');
        
  return Promise.reject();
});
```

### Custom response

```javascript
const Response = require('@skazka/server-response/response');

app.then(async (ctx) => {
  const response = new Response(ctx);
    
  return response.resolve('data');
});
```

## Redirect

```javascript
app.then(async (ctx) => {
  return ctx.response.redirect(url = '/', code = 301);
});
```

### Custom redirect

```javascript
app.then(async (ctx) => {
  const response = new Response(ctx);

  return response.redirect(url = '/', code = 301);
});
```

### Reject

If you need to send request with error and finish response

```javascript
app.then(async (ctx) => {
  return ctx.response.reject(new Error('test'));
});
```
