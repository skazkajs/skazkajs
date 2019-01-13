---
id: response
title: Server Response
sidebar_label: Server Response
---

Skazka Server response.

## How to install

    npm i @skazka/server @skazka/server-response
    
With yarn:

    yarn add @skazka/server @skazka/server-response
    
Optionally you can add http server, error handler, logger, router and request:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request

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
    
app.then(async (ctx) => {
  // it works for each request
  // it stops all other modules
  return ctx.response('data'); 
});
    
router.get('/data').then(async (ctx) => {
  // it works only for this route
  return ctx.response('data'); 
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
    
  return response.send(data = '', code = 200, contentType = 'text/plain');
});
```

## Redirect

```javascript
app.then(async (ctx) => {
  return ctx.redirect(url = '/', code = 301);
});
```

### Custom redirect

```javascript
app.then(async (ctx) => {
  const response = new Response(ctx);

  return response.redirect(url = '/', code = 301);
});
```

## Set header

```javascript
app.then(async (ctx) => {
  ctx.setHeader('Content-Type', 'text/plain');
  
  return ctx.response('');
});
```

### Custom response

```javascript
app.then(async (ctx) => {
  const response = new Response(ctx);

  response.setHeader('Content-Type', 'text/plain');
  
  return response.send('');
});
```

## JSON

```javascript
app.then(async (ctx) => {
  return ctx.json(data, code = 200);
});
```

### Custom json response

```javascript
app.then(async (ctx) => {
  const response = new Response(ctx);

  return response.sendJSON(data, code = 200);
});
```
