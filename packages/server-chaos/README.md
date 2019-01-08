# Server Chaos

Chaos Monkey implementation for Skazka Server.

[![NPM](https://nodei.co/npm/@skazka/server-chaos.png)](https://npmjs.org/package/@skazka/server-chaos)

## How to install

    npm i @skazka/server @skazka/server-chaos
    
With yarn:

    yarn add @skazka/server @skazka/server-chaos
    
Optionally you can add http server, error handler, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

### Config

#### config/default.json

```json
{
  "chaos": {
    "enabled": true,
    "error": {
      "probability": 0.1 // 0..1
    },
    "timeout": {
      "probability": 0.1, // 0..1
      "time": 30 // seconds
    }
  }
}
```

### Server module

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const chaos = require('@skazka/server-chaos');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request ');
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
  // it works for any request
  // no chaos for now
});

app.then(chaos()); // it runs chaos next modules

router.get('/data').then(async (ctx) => {
  // with chaos
  return ctx.response(result); 
});

app.then(router.resolve());
        
server.createHttpServer(app);
```
