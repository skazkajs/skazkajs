---
id: server-module
title: Server Module Builder
sidebar_label: Server Module Builder
---

Skazka Server Module Builder helps to create a new modules.

## How to install

    npm i @skazka/server @skazka/server-module
    
With yarn:

    yarn add @skazka/server @skazka/server-module
    
Optionally you can add http server, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');

const request = require('@skazka/server-request');
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');

const moduleBuilder = require('@skazka/server-module');

const app = new App();
const router = new Router();

const newModule = moduleBuilder((context) => {
  // use context
});

app.all([
  error(),
  logger(),
  request(),
  response(),
  newModule(),
]);
    
app.then(async (ctx) => {
  // code for each request
  await newModule(ctx); // works for each next module
});
    
router.get('/data').then(async (ctx) => {
  await newModule(ctx); // works only for this route
  
  return ctx.response(ctx.req.body); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

## More examples

### Create a new module:

```javascript
module.exports = moduleBuilder((context) => {
  // use context
});
```

```javascript
module.exports = moduleBuilder((context, options) => {
  // use context and options
});
```

```javascript
module.exports = moduleBuilder((context, option1, option2) => {
  // use context and options
});
```

### Using a new module:

```javascript
app.then(module());
app.then(module(options));
app.then(module(option1, option2));
```

```javascript
app.all([
  ...
  module(),
  ...
]);
app.all([
  ...
  module(options),
  ...
]);
app.all([
  ...
  module(option1, option2),
  ...
]);
```

```javascript
app.then(async (ctx) => {
  await module(ctx);
  await module(ctx, options);
  await module(ctx, option1, option2);
});
```  

```javascript
app.then(async (ctx) => {
  await module()(ctx);
  await module(options)(ctx);
  await module(option1, option2)(ctx);
});
``` 
