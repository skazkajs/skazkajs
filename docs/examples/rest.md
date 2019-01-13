---
id: rest
title: Server REST API
sidebar_label: REST API
---

This example shows how to use router, body parser and CORS packages to create REST API.

## How to install

    npm i @skazka/server @skazka/server-init @skazka/server-router @skazka/server-body-parser @skazka/server-cors @skazka/server-http debug axios jest
    
With yarn:

    yarn add @skazka/server @skazka/server-init @skazka/server-router @skazka/server-body-parser @skazka/server-cors @skazka/server-http debug axios jest
    
## How to use

### index.js

```javascript
const Server = require('@skazka/server');
const Router = require('@skazka/server-router');

const init = require('@skazka/server-init');
const bodyParser = require('@skazka/server-body-parser');
const cors = require('@skazka/server-cors');

const server = new Server();
const router = new Router();

const users = [];

server
  .then(init({ error: { isJSON: true } }))
  .then(cors());

router.get('/').then(ctx => ctx.redirect('/users'));

router.get('/users').then(ctx => ctx.response(users));

router.post('/users').then(async (ctx) => {
  await bodyParser.json(ctx);

  users.push(ctx.request.body);

  return ctx.response({ message: 'User saved' });
});

server.then(router.resolve());

module.exports = server;
```

### bin/www

```
#!/usr/bin/env node

const server = require('@skazka/server-http');
const app = require('..');

server.createHttpServer(app);
```

### index.test.js

```javascript
const srv = require('@skazka/server-http');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

const app = require('.');

const host = `http://localhost:${process.env.PORT || '3000'}`;

axios.defaults.host = host;
axios.defaults.adapter = httpAdapter;

describe('REST example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test redirect', async () => {
    await axios.get(host, { maxRedirects: 0 }).catch(({ response }) => {
      expect(response.status).toEqual(301);
      expect(response.statusText).toEqual('Moved Permanently');
      expect(response.data).toContain('/users');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // redirect
      expect(response.headers.location).toEqual('/users');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test GET /users', async () => {
    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toEqual([]);
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });

  test('It should test POST /users', async () => {
    const user = { name: 'test' };
    await axios.post(`${host}/users`, user).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data.message).toEqual('User saved');
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });

    await axios.get(`${host}/users`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data[0]).toEqual(user);
      // helmet headers
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      // cors header
      expect(response.headers['access-control-allow-origin']).toEqual('*');
      // init({ error: { isJSON: true } }) it sets json header
      expect(response.headers['content-type']).toEqual('application/json');
    });
  });
});
```

### package.json

```json
{
  "name": "example-rest",
  "version": "0.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "node bin/www",
    "test": "PORT=7000 jest  --coverage --runInBand"
  },
  "keywords": [
    "rest",
    "node.js",
    "skazka"
  ],
  "author": "skazkajs",
  "license": "MIT",
  "dependencies": {
    "@skazka/server": ">=0.0.0",
    "@skazka/server-body-parser": ">=0.0.0",
    "@skazka/server-cors": ">=0.0.0",
    "@skazka/server-http": ">=0.0.0",
    "@skazka/server-init": ">=0.0.0",
    "@skazka/server-router": ">=0.0.0",
    "axios": ">=0.18.0",
    "debug": ">=4.0.0",
    "jest": ">=23.6.0"
  }
}
```

## Commands

### Run app

    npm start
    
Or

    yarn start
    
### Test app

    npm test
    
Or

    yarn test

## More docs

- [Server](https://skazkajs.org/server)
- [Server init](https://skazkajs.org/server/init)
- [Server Router](https://skazkajs.org/server/router)
- [Server Body Parser](https://skazkajs.org/server/body-parser)
- [Server CORS](https://skazkajs.org/server/cors)
- [Server HTTPS(S)](https://skazkajs.org/server/http)

## Copy from git

Clone:

    git clone https://github.com/skazkajs/skazka.git
    cd skazka/examples/rest

Install:
    
    npm i

Or 

    yarn
    
And run **start** or **test** [commands](#commands).
