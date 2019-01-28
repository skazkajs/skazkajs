# Server Init

Pack of useful packages: 
- [cookies](https://npmjs.org/package/@skazka/server-cookies),
- [error](https://npmjs.org/package/@skazka/server-error),
- [helmet](https://npmjs.org/package/@skazka/server-helmet),
- [logger](https://npmjs.org/package/@skazka/server-logger),
- [request](https://npmjs.org/package/@skazka/server-request),
- [response](https://npmjs.org/package/@skazka/server-response).

[![NPM](https://nodei.co/npm/@skazka/server-init.png)](https://npmjs.org/package/@skazka/server-init)

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
You can set this option by setting "object" instead of "true":

```javascript
app.then(init({ error: { hasUserError: false } }));
```

To see more info check each module documentation.

