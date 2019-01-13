---
id: static
title: Server Static
sidebar_label: Server Static
---

Skazka Server Static helps to serve static files.

There are 3 Skazka Server modules for working with static files:
- **Skazka Server Index** should be the first module for checking url and returning index.html file without caching.
- **Skazka Server Static** should be second module for serving any static files with a cache system.
- **Skazka Server SPA** module should be the last module in the app chain (after router, graphQL...).
It returns index.html file for any request - the main idea of any SPA server.

## How to install

    npm i @skazka/server @skazka/server-static
    
With yarn:

    yarn add @skazka/server @skazka/server-static
    
##### Skazka Server index and spa:

    npm i @skazka/server @skazka/server-index @skazka/server-spa
    
With yarn:

    yarn add @skazka/server @skazka/server-index @skazka/server-spa
    
Optionally you can add http server, error handler, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

```javascript
const { resolve } = require('path');

const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const index = require('@skazka/server-index');
const serve = require('@skazka/server-static');
const spa = require('@skazka/server-spa');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request');
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();

const root = resolve(__dirname, 'dist');

app.all([
  error(),
  logger(),
  request(),
  response(),
  index({ root }),
]).then(serve({ root, index: false }));
    
app.then(async (ctx) => {
  // it works for any request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response('data'); 
});
        
app.then(router.resolve());

app.then(spa({ root }));

server.createHttpServer(app);
```

### Options

- **root** - directory with index file, by default: **__dirname**.
- **index** - file name, by default: **index.html** (you can use for example index.htm...). Or **false** to disable serving index file (useful working with Skazka Server Index).
- **etag** - caching using etag, by default: **true**.
- **gzip** - compression functionality, by default: **true**.
- **maxage** - caching using maxage, by default: **0**.

Example with all options:

```javascript
app.all([
  ...
  serve({
    root: resolve(__dirname, 'dist'),
    index: 'index.html',
    etag: true,
    gzip: true,
    maxage: 0,
  }),
]);
```

#### With virtual host

```javascript
const { resolve } = require('path');

const App = require('@skazka/server');
const VirtualHost = require('@skazka/server-virtual-host');
const Router = require('@skazka/server-router');

const serve = require('@skazka/server-static');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
const vhost = new VirtualHost();

const root = resolve(__dirname, 'dist');
    
app.all([
  error({ isJSON: true }),
  logger(),
  response(),
]);
    
router.get('/').then(ctx => ctx.response({ status : 'OK' }));
    
vhost.http('api.skazkajs.org').then(router.resolve());
        
vhost.http('static.skazkajs.org').then(serve({ root }));

app.then(vhost.resolve());
    
server.createHttpServer(app);
```
