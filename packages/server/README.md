# Server

Each Node.js server is a handler for http(s) server **request** event:

Example:

```javascript
const http = require('http');

const server = http.createServer( (req, res) => {
  ctx.res.statusCode = 200;
  res.end('okay');
});
```
   
[Anatomy of an HTTP Transaction](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/)
