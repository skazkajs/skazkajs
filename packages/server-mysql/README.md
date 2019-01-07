# Server MySQL

Skazka Server Promise based mysql client.

[![NPM](https://nodei.co/npm/@skazka/server-mysql.png)](https://npmjs.org/package/@skazka/server-mysql)

## How to install

    npm i @skazka/server @skazka/server-mysql
    
With yarn:

    yarn add @skazka/server @skazka/server-mysql
    
Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

### Config

#### config/default.json

```json
{
  "mysql": {
    "host": "127.0.0.1",
    "port": 3306,
    "user": "user",
    "password": "password",
    "database": "database",
    "connectionLimit": 10
  }
}
```

### Server module

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const mysql = require('@skazka/server-mysql');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  mysql(),
  response(),
]);
    
app.then(async (ctx) => {
  // it works for each request
  const rows = await ctx.mysql.query('select * from users;');
});
    
router.get('/data').then(async (ctx) => {
  const rows = await ctx.mysql.query('select * from users;');
            
  return ctx.response(rows); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

With connection:

```javascript
app.then(async (ctx) => {
  const connection = await ctx.mysql.getConnection();
  const rows = await connection.query('select * from users;');
  ctx.mysql.releaseConnection(connection);
  
  return ctx.response(rows); 
});
```

### Any other module

```javascript
const pool = require('@skazka/server-mysql/pool');
    
async () => {
  try {
    const rows = await pool.query('select * from users;');
  } catch (error) {
    
  }
};
```
    
With connection:

```javascript
const pool = require('@skazka/server-mysql/pool');
    
async () => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query('select * from users;');
    pool.releaseConnection(connection);
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
const response = require('@skazka/server-response');
    
const mysql = require('@skazka/server-mysql');
    
app.all([
  error(),
  logger(),
  mysql(),
  response(),
]);
    
app.then(async (ctx) => {
  const connection = await ctx.mysql.getConnection();
  let rows = [];
        
  try {
    await connection.beginTransaction()
    rows = await connection.query('select * from users;');
    await connection.commit();
  } catch (e) {
    await connection.rollback();
  } finally {
    ctx.mysql.releaseConnection(connection);
  }
  
  return ctx.response(rows);
});
```
    
Or in any other module:

```javascript
const pool = require('@skazka/server-mysql/pool');
    
async () => {
  const connection = await pool.getConnection();
    
  try {
   await connection.beginTransaction();
   await connection.query('select * from users;');
   await connection.commit();
  } catch (error) {
    await connection.rollback();
  } finally {
    pool.releaseConnection(connection);
  }
};
```
