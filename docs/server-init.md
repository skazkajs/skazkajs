---
id: server-init
title: Server Init
sidebar_label: Server Init
---

Pack of useful packages for running server:
- [Server Request](/server-request)
- [Server Response](/server-response)
- [Server Error](/server-error)
- [Server Logger](/server-logger)
- [Server Cookies](/server-cookies)
- [Server Helmet](/server-helmet)

## How to install

    npm i @skazka/server @skazka/server-init
    
With yarn:

    yarn add @skazka/server @skazka/server-init
    
Optionally you can add http server and router:

    npm i @skazka/server-http @skazka/server-router
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const init = require('@skazka/server-init');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.then(init());
    
app.then(async (ctx) => {
  // it works for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

## Configuration

To enable or disable any module:

```javascript
app.then(init({ moduleName: true }));
```
Or
```javascript
app.then(init({ moduleName: false }));
```
By default all modules are enabled.

Fo example, to disable cookies:

```javascript
app.then(init({ cookies: false }));
```

Modules error, logger and helmet have own options.

You can set those option by setting "object" instead of "true":

```javascript
app.then(init({ error: { hasUserError: false } }));
```

To see more info check each module documentation.

