# Server Error Handler

Simple 404/500 error handler.

[![NPM](https://nodei.co/npm/@skazka/server-error.png)](https://npmjs.org/package/@skazka/server-error)

## How to install

    npm i @skazka/server @skazka/server-error
    
With yarn:

    yarn add @skazka/server @skazka/server-error
    
Optionally you can add http server, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response

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
  // code for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

## Config

### JSON request

To set application/json Content-Type header for each response:

```javascript
app.all([
  // res.setHeader('Content-Type', 'application/json')
  error({ isJSON: true }),
]);
```
     
### Hide user error (404)

If you have own user error handler, you can disable it:

```javascript
app.all([
  error({ hasUserError: false }),
]);
````
     
### Hide server error (500)

If you have own error handler, you can disable it:

```javascript
app.all([
  error({ hasServerError: false }),
]);
```

## Custom error handlers

To add custom user error handler for 404 error you need to add last app.then and finish response:

```javascript
// 404 error handler
app.then(async (ctx) => {
  return ctx.response('Not Found', 404);
  
  // Or
  // return ctx.json({ message: 'Not Found' }, 404);
  
  // Or
  // ctx.res.statusCode = 404;
  // ctx.res.end('Not Found');
});
```

To add app error handler for 500 error you need to add app.catch:

```javascript
// 500 error handler
app.catch(async (err, ctx) => {
  return ctx.response('Internal Server Error', 500);
  
  // Or
  // return ctx.json({ message: 'Internal Server Error' }, 500);
   
  // Or
  // ctx.res.statusCode = 500;
  // ctx.res.end('Internal Server Error');
});
```
