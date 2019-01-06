# Server

Simple promised node http request-response handler.

[![NPM](https://nodei.co/npm/@skazka/server.png)](https://npmjs.org/package/@skazka/server)

Each Node.js server is a handler for http(s) server **request** event:

Example:

```javascript
const http = require('http');

const server = http.createServer( (req, res) => {
  ctx.res.statusCode = 200;
  res.end('okay');
});
```
   
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)

There are many popular frameworks like express.js or koa created to handle user requests.

But all of them use ideas from other programming languages or they are too old.

Skazka Server created with deep understanding of JavaScript core (and node.js), its new ideas like promises and async/await.

Core of the server was created to resolve highload problems, work as a separate server or with serverless.

And performance is the main reason to maintain this server because in real life you need to pay for each millisecond. 

## How to install

    npm i @skazka/server
    
With yarn:

    yarn add @skazka/server
    
## How to use
    
```javascript
const App = require('@skazka/server');

const app = new App();
    
app.then(async (ctx) => {
  ctx.res.statusCode = 200;
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end('{"status":"OK"}');
});
    
app.catch(async (error, ctx) => {
  ctx.res.statusCode = 500;
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify({ error }));
});

module.exports = app;
```

## Breaking chain

```javascript
app.then(async (ctx) => {
  ctx.res.statusCode = 200;
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end('{"status":"OK"}');
      
  return Promise.reject();
}).then(async () => {
  // it won't work
}).catch(async () => {
  // it won't work
});
```

## Real example

Add http server, error handler, logger, router and response:
    
    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
          
With yarn:
    
    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

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
  // code for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response.resolve('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```
