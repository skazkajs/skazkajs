# Server Body Parser

Skazka Server request body parser..

[![NPM](https://nodei.co/npm/@skazka/server-body-parser.png)](https://npmjs.org/package/@skazka/server-body-parser)

## How to install

    npm i @skazka/server @skazka/server-body-parser
    
With yarn:

    yarn add @skazka/server @skazka/server-body-parser
    
Optionally you can add http server, logger, router, request  and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const bodyParser = require('@skazka/server-body-parser');

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
  bodyParser.json(), // it works for all next modules
]);
    
app.then(async (ctx) => {
  // code for each request
  await bodyParser.json(ctx); // it works for all next modules
});
    
router.get('/data').then(async (ctx) => {
  await bodyParser.json(ctx); // it works only for this route
  
  return ctx.response(ctx.get('request').body); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

As this module is wrapper for [body-parser](https://github.com/expressjs/body-parser),
you can use the same options:

```javascript
app.then(bodyParser.json(options));
```

```javascript
app.then(bodyParser.text(options));
```

```javascript
app.then(bodyParser.raw(options));
```

```javascript
app.then(bodyParser.urlencoded(options));
```
