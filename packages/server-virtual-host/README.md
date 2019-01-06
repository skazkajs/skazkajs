# Server Virtual Host

Skazka Server Virtual Host helps to work with different domains splitting http / https protocols.

[![NPM](https://nodei.co/npm/@skazka/server-virtual-host.png)](https://npmjs.org/package/@skazka/server-virtual-host)

## How to install

    npm i @skazka/server @skazka/server-virtual-host
    
With yarn:

    yarn add @skazka/server @skazka/server-virtual-host
    
Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

### HTTP:

```javascript
vhost.http('skazkajs.org').then(async ctx => {
  ctx.response.resolve('response');
});
```
        
### HTTPS:

```javascript
vhost.https('skazkajs.org').then(async ctx => {
  return ctx.response.resolve('response'); 
});
```

### Any host:

```javascript
vhost.any('*.skazkajs.org').then(async ctx => {
  return ctx.response.resolve('response');     
});
```
            
### All methods are wrappers for catch() method:

```javascript
vhost.catch({ domain, protocol: '*|http|https' }).then(async ctx => {
  return ctx.response.resolve('response');     
});
```
    
## Examples

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
const response = require('@skazka/server-response');

const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
const vhost = new VirtualHost();
        
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

vhost.http('skazkajs.org').then(router.resolve());

app.then(vhost.resolve());
        
server.createHttpServer(app);
```

### SSL

```javascript
const { readFileSync } = require('fs');
const { resolve } = require('path');

const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
const response = require('@skazka/server-response');

const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
const vhost = new VirtualHost();
        
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

vhost.https('skazkajs.org').then(router.resolve());

app.then(vhost.resolve());
        
const options = {
  key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
  cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem'))
};
        
server.createHttpsServer(options, app);
```

### Single Page Application (SPA)

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
const response = require('@skazka/server-response');

const server = require('@skazka/server-http');

const index = require('@skazka/server-index');
const serve = require('@skazka/server-static');
const spa = require('@skazka/server-spa');

const app = new App();
const router = new Router();
const vhost = new VirtualHost();

const root = resolve(__dirname, 'dist');

app.all([
  error(),
  logger(),
  response(),
  index({ root }),
]).then(serve({ root, index: false }));
    
app.then(async (ctx) => {
  // code for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response.resolve('data'); 
});

vhost.http('skazkajs.org').then(router.resolve());

app.then(vhost.resolve());

app.then(spa({ root }));

server.createHttpServer(app);
```

### Subdomains

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
const response = require('@skazka/server-response');

const server = require('@skazka/server-http');

const serve = require('@skazka/server-static');
const spa = require('@skazka/server-spa');

const app = new App();
const router = new Router();
const vhost = new VirtualHost();

const root = resolve(__dirname, 'dist');

app.all([
  error(),
  logger(),
  response(),
]);

router.get('/users').then(async (ctx) => {
  return ctx.response.resolve([{ id: 1 }, { id: 2 }]); 
});

vhost.http('skazkajs.org').then(spa({ root }));
vhost.http('cdn.skazkajs.org').then(serve({ root }));
vhost.http('api.skazkajs.org').then(router.resolve());

app.then(vhost.resolve());
        
server.createHttpServer(app);
```

### Redirect from http to https

```javascript
const { readFileSync } = require('fs');
const { resolve } = require('path');

const App = require('@skazka/server');
const Router = require('@skazka/server-router');
const VirtualHost = require('@skazka/server-virtual-host');

const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');

// HTTP

const app = new App();
const vhost = new VirtualHost();
        
app.all([
  error(),
  logger(),
  response(),
]);

vhost.http('skazkajs.org').then(ctx => ctx.response.redirect('https://skazkajs.org/'));

app.then(vhost.resolve());

server.createHttpServer(app, 80);

// HTTPS

const appSSL = new App();
const routerSSL  = new Router();
const vhostSSL  = new VirtualHost();

appSSL.all([
  error(),
  logger(),
  response(),
]);

appSSL.then(async (ctx) => {
  // code for each request
});
    
routerSSL.get('/data').then(async (ctx) => {
  return ctx.response.resolve('data'); 
});

vhostSSL.https('skazkajs.org').then(routerSSL.resolve());

appSSL.then(vhostSSL.resolve());
        
const options = {
  key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
  cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem'))
};
        
server.createHttpsServer(options, appSSL, 443);
```
