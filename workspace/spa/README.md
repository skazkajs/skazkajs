# Server SPA example

There are 3 Skazka Server modules for working with static files:
- **Skazka Server Index** should be the first module for checking url and returning index.html file without caching.
- **Skazka Server Static** should be second module for serving any static files with a cache system.
- **Skazka Server SPA** module should be the last module in the app chain (after router, graphQL...).
It returns index.html file for any request - the main idea of any SPA server.

## How to install

    npm i @skazka/server @skazka/server-index @skazka/server-static @skazka/server-spa @skazka/server-init @skazka/server-http axios mocha chai sinon
    
With yarn:

    yarn add @skazka/server @skazka/server-index @skazka/server-static @skazka/server-spa @skazka/server-init @skazka/server-http axios mocha chai sinon
    
## How to use

### index.js

```javascript
const { resolve } = require('path');

const Server = require('@skazka/server');

const init = require('@skazka/server-init');
const index = require('@skazka/server-index');
const serv = require('@skazka/server-static');
const spa = require('@skazka/server-spa');

const server = new Server();

const root = resolve(__dirname, 'dist');

server
  .then(init())
  .then(index({ root }))
  .then(serv({ root }))
  .then(spa({ root }));

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

describe('SPA example test', async () => {
  let server;

  beforeEach(() => {
    server = srv.createHttpServer(app);
  });

  afterEach((done) => {
    server.close(done);
  });

  test('It should test serving', async () => {
    await axios.get(host).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('<div>Test page</div>');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      expect(response.headers['surrogate-control']).toEqual('no-store');
      expect(response.headers['cache-control']).toEqual('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers.pragma).toEqual('no-cache');
      expect(response.headers.expires).toEqual('0');
      expect(response.headers['content-type']).toEqual('text/html;charset=UTF-8');
    });
  });

  test('It should test serving js', async () => {
    await axios.get(`${host}/js/scripts.js`).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual('OK');
      expect(response.data).toContain('console.log');
      expect(response.headers['x-dns-prefetch-control']).toEqual('off');
      expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
      expect(response.headers['strict-transport-security']).toEqual('max-age=15552000; includeSubDomains');
      expect(response.headers['x-download-options']).toEqual('noopen');
      expect(response.headers['x-content-type-options']).toEqual('nosniff');
      expect(response.headers['x-xss-protection']).toEqual('1; mode=block');
      expect(response.headers.etag).toEqual('/js/scripts.js');
      expect(response.headers['content-type']).toEqual('application/javascript; charset=utf-8');
    });
  });
});
```

### package.json

```json
{
  "name": "example-spa",
  "version": "0.0.0",
  "description": "",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "node bin/www",
    "test": "PORT=7000 mocha **/*.test.js"
  },
  "keywords": [
    "spa",
    "node.js",
    "skazka"
  ],
  "author": "skazkajs",
  "license": "MIT",
  "dependencies": {
    "@skazka/server": ">=0.0.0",
    "@skazka/server-http": ">=0.0.0",
    "@skazka/server-index": ">=0.0.0",
    "@skazka/server-init": ">=0.0.0",
    "@skazka/server-spa": ">=0.0.0",
    "@skazka/server-static": ">=0.0.0",
    "axios": ">=0.18.0"
  }
}
```

### dist directory

Create **dist** directory and put index.html, images, css and js files there.

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
- [Server Index](https://skazkajs.org/server/index)
- [Server Static](https://skazkajs.org/server/static)
- [Server SPA](https://skazkajs.org/server/spa)
- [Server HTTPS(S)](https://skazkajs.org/server/http)

## Copy from git

Clone:

    git clone https://github.com/skazkajs/skazka.git
    cd skazka/examples/spa

Install:
    
    npm i

Or 

    yarn
    
And run **start** or **test** [commands](#commands).
