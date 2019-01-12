# Server PostgreSQL

Skazka Server PostgreSQL client.

[![NPM](https://nodei.co/npm/@skazka/server-pg.png)](https://npmjs.org/package/@skazka/server-pg)

## How to install

    npm i @skazka/server @skazka/server-pg pg config
    
With yarn:

    yarn add @skazka/server @skazka/server-pg pg config
    
Optionally you can add http server, error handler, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

### Config

#### config/default.json

```json
{
  "pg": {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "user",
    "password": "password",
    "database": "database"
  }
}
```

### Server module

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const pg = require('@skazka/server-pg');
        
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
  pg(),
  response(),
]);
    
app.then(async (ctx) => {
  // it works for each request
  const result = await ctx.pg.query('SELECT * FROM users;');
});
    
router.get('/data').then(async (ctx) => {
  const result = await ctx.pg.query('SELECT * FROM users;');
            
  return ctx.response(result); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

With connection:

```javascript
app.then(async (ctx) => {
  const client = await ctx.pg.connect();
  const result = await client.query('SELECT * FROM users;');
  client.release();
  
  return ctx.response(result); 
});
```

### Any other module

```javascript
const pool = require('@skazka/server-pg/pool');
    
async () => {
  try {
    const result = await pool.query('SELECT * FROM users;');
  } catch (error) {
    
  }
};
```
    
With connection:

```javascript
const pool = require('@skazka/server-pg/pool');
    
async () => {
  try {
    const client = await ctx.pg.connect();
    const result = await client.query('SELECT * FROM users;');
  } catch (error) {

  } finally {
    client.release();
  }
};
```
    
### Transactions

```javascript
const App = require('@skazka/server');
const app = new App();
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
    
const pg = require('@skazka/server-pg');
    
app.all([
  error(),
  logger(),
  pg(),
]);
    
app.then(async (ctx) => {
  const client = await ctx.pg.connect();
        
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM users;');
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
});
```
    
Or in any other module:

```javascript
const pool = require('@skazka/server-pg/pool');
    
async () => {
  const client = await pool.connect();
    
  try {
   await client.query('BEGIN');
   await client.query('DELETE FROM users;');
   await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};
```
