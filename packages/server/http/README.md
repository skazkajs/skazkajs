# HTTP(S) Server

It helps to run Skazka app as node.js server.

[![NPM](https://nodei.co/npm/@skazka/server-http.png)](https://npmjs.org/package/@skazka/server-http)

## How to install

    npm i @skazka/server @skazka/server-http
    
With yarn:

    yarn add @skazka/server @skazka/server-http
    
Optionally you can add error handler, logger, router, request and response:

    npm i @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

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
});
    
router.get('/data').then(async (ctx) => {
  // it works only for "/url"
  return ctx.response('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

### Run with ssl/tls

```javascript
const { readFileSync } = require('fs');
const { resolve } = require('path');

const options = {
  key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
  cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem'))
};
        
server.createHttpsServer(options, app);
```

### With pem

[Pem](https://www.npmjs.com/package/pem) package helps to generate pem files for you.
It could be useful for testing.

    npm i pem
 
With yarn:

    yarn add pem

```javascript
const days = 1;
const selfSigned = true;
    
pem.createCertificate({ days, selfSigned }, (err, { serviceKey: key, certificate: cert }) => {
  if (err) {
    throw err;
  }
  server.createHttpsServer({ key, cert }, app);
});
```

And async/await:

```javascript
const util = require('util');

const createCertificate = util.promisify(pem.createCertificate);

(async () => {
  const days = 1;
  const selfSigned = true;
  
  const { 
    serviceKey: key, 
    certificate: cert,
  } = await createCertificate({ days, selfSigned });
  
  server.createHttpsServer({ key, cert }, app);
})();
```

### Port

By default server uses port from **process.env.PORT**:

    PORT=3000 node index.js

But you can set port in the code:

```javascript
server.createHttpServer(app, 80);
server.createHttpsServer({ key, cert }, app, 443);
```
