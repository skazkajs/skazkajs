---
id: spa
title: Server SPA
sidebar_label: Server SPA
---

Skazka Server single page application (SPA) is serving index.html file without cache.

There are 3 Skazka Server modules for working with static files:
- **Skazka Server Index** should be the first module for checking url and returning index.html file without caching.
- **Skazka Server Static** should be second module for serving any static files with a cache system.
- **Skazka Server SPA** module should be the last module in the app chain (after router, graphQL...).
It returns index.html file for any request - the main idea of any SPA server.

## How to install

    npm i @skazka/server @skazka/server-spa
    
With yarn:

    yarn add @skazka/server @skazka/server-spa
    
##### Skazka Server index and static:

    npm i @skazka/server @skazka/server-index @skazka/server-static
    
With yarn:

    yarn add @skazka/server @skazka/server-index @skazka/server-static
    
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

- **root** - directory with index file, by default: __dirname.
- **index** - file name, by default: index.html (you can use for example index.htm...).

Example with all options:

```javascript
app.all([
  ...
  spa({
    root: resolve(__dirname, 'dist'),
    index: 'index.html',
  }),
]);
```
