# Server Router

Skazka promise based router.

[![NPM](https://nodei.co/npm/@skazka/server-router.png)](https://npmjs.org/package/@skazka/server-router)

## How to install

    npm i @skazka/server @skazka/server-router
    
With yarn:

    yarn add @skazka/server @skazka/server-router
    
Optionally you can add http server, error handler, logger, request and  response:

    npm i @skazka/server-http @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

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
  return ctx.response('data');
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

## Methods

* all(url)
* head(url)
* options(url)
* get(url)
* post(url)
* patch(url)
* post(url)
* delete(url) or del(url)

All methods are wrappers for catch() method:

**catch({ method: 'GET', url: '/' })**

```javascript
router.catch().then(async (ctx) => {
  return ctx.response('data');
});
    
router.catch({ method: 'POST' }).then(async (ctx) => {
  return ctx.response('data');
});
    
router.catch({ url: '/data' }).then(async (ctx) => {
  return ctx.response('data');
});
    
router.catch({ method: 'POST', url: '/data' }).then(async (ctx) => {
  return ctx.response('data');
});
```

## Chain

You can use chain of methods:

```javascript
router.get('/').then(async (ctx) => {
  return ctx.response('data');
}).post('/data').then(async (ctx) => {
  return ctx.response('data');
});
```
    
## Request parameters

### Query

**url**: */?data=test*

```javascript
router.get('/').then(async (ctx) => {
  return ctx.response(ctx.request.query.data); // test
});
```
    
### Parameters

**url**: */test/125*

```javascript
router.get('/test/:id').then(async (ctx) => {
  return ctx.response(ctx.request.params.id); // 125
});
```

## With body parser

```javascript
const bodyParser = require('@skazka/server-body-parser');

router.post('/test/:id').then(async (ctx) => {
  const body = await bodyParser.json(ctx);
  
  return ctx.response(body);
  
  // Or 
  // return ctx.response(ctx.request.body);
});
```

## With virtual host

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request');
const response = require('@skazka/server-response');
const bodyParser = require('@skazka/server-body-parser');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  request(),
  response(),
]);

const vhost = new VirtualHost();

router.post('/test/:id').then(async (ctx) => {
  await bodyParser.json(ctx);
  
  return ctx.response(ctx.request.body);
});

vhost.http('skazkajs.org').then(router.resolve());

app.then(vhost.resolve());

server.createHttpServer(app);
```

Or with SSL:

```javascript
const { readFileSync } = require('fs');
const { resolve } = require('path');

const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
const bodyParser = require('@skazka/server-body-parser');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  response(),
]);

const vhost = new VirtualHost();

router.post('/test/:id').then(async (ctx) => {
  await bodyParser.json(ctx);
  
  return ctx.response(ctx.request.body);
});

const options = {
  key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
  cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem')),
};

vhost.https('skazkajs.org').then(router.resolve());

app.then(vhost.resolve());

server.createHttpsServer(options, app);
```
