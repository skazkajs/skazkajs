# Server Redis

Skazka Server Redis client.

[![NPM](https://nodei.co/npm/@skazka/server-redis.png)](https://npmjs.org/package/@skazka/server-redis)

## How to install

    npm i @skazka/server @skazka/server-redis
    
With yarn:

    yarn add @skazka/server @skazka/server-redis
    
Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

### Config

config/default.json

```json
{
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  }
}
```
    
### Server module

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
    
const redis = require('@skazka/server-redis');
    
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
    
const response = require('@skazka/server-response');
    
const server = require('@skazka/server-http');
    
const app = new App();
const router = new Router();
    
app.all([
  error(),
  logger(),
  redis(),
  response(),
]);
    
app.then(async ctx => {
  await ctx.redis.set('data', 'test');
  const data = await ctx.redis.get('data');
});
    
router.get('/url').then(async ctx => {
  await ctx.redis.set('data', 'test');
  const data = await ctx.redis.get('data');
        
  return ctx.response.resolve(data); 
});
    
app.then(router.resolve());
    
server.createHttpServer(app);
```   

### Any other module

You can use redis client in any app module:
```javascript
const redis = require('@skazka/server-redis/redis');
    
async () => {
  await redis.set('test', 'test');
  const data = await redis.get('test');
}
```
