# Server Helmet

It helps to secure your Skazka server by setting various HTTP headers.

[![NPM](https://nodei.co/npm/@skazka/server-helmet.png)](https://npmjs.org/package/@skazka/server-helmet)

## How to install

    npm i @skazka/server @skazka/server-helmet
    
With yarn:

    yarn add @skazka/server @skazka/server-helmet
    
Optionally you can add http server, error handler, logger, router, request and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-request @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const helmet = require('@skazka/server-helmet');
        
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
  helmet(),
]);
    
app.then(async (ctx) => {
  // it works for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response('data'); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

Or with **options**:

```javascript
app.all([
  helmet({
    frameguard: false,
    ...
  })
]);
``` 

You can also use its pieces individually:

```javascript
 app.all([
   helmet.contentSecurityPolicy({
     directives: {
       defaultSrc: ["'self'", 'default.com'],
     },
   }),
   helmet.dnsPrefetchControl(),
   helmet.expectCt(),
   helmet.featurePolicy({
     features: {
       fullscreen: ['"self"'],
     },
   }),
   helmet.frameguard(),
   helmet.hidePoweredBy(),
   helmet.hpkp({
     maxAge: 7776000,
     sha256s: ['AbCdEf123=', 'ZyXwVu456='],
   }),
   helmet.hsts({
     maxAge: 7776000,
   }),
   helmet.ieNoOpen(),
   helmet.noCache(),
   helmet.noSniff(),
   helmet.permittedCrossDomainPolicies(),
   helmet.referrerPolicy(),
   helmet.xssFilter(),
 ]);
 ``` 
 
 How it works
 ------------
 
 Helmet is a collection of 14 smaller middleware functions that set HTTP response headers. 
 Running `app.than(helmet())` will not include all of these middleware functions by default.
 
 | Module | Default? |
 |---|---|
 | [contentSecurityPolicy](https://helmetjs.github.io/docs/csp/) for setting Content Security Policy |  |
 | [crossdomain](https://helmetjs.github.io/docs/crossdomain/) for handling Adobe products' crossdomain requests |  |
 | [dnsPrefetchControl](https://helmetjs.github.io/docs/dns-prefetch-control) controls browser DNS prefetching | ✓ |
 | [expectCt](https://helmetjs.github.io/docs/expect-ct/) for handling Certificate Transparency |  |
 | [featurePolicy](https://helmetjs.github.io/docs/feature-policy/) to limit your site's features |  |
 | [frameguard](https://helmetjs.github.io/docs/frameguard/) to prevent clickjacking | ✓ |
 | [hidePoweredBy](https://helmetjs.github.io/docs/hide-powered-by) to remove the X-Powered-By header | ✓ |
 | [hpkp](https://helmetjs.github.io/docs/hpkp/) for HTTP Public Key Pinning |  |
 | [hsts](https://helmetjs.github.io/docs/hsts/) for HTTP Strict Transport Security | ✓ |
 | [ieNoOpen](https://helmetjs.github.io/docs/ienoopen) sets X-Download-Options for IE8+ | ✓ |
 | [noCache](https://helmetjs.github.io/docs/nocache/) to disable client-side caching |  |
 | [noSniff](https://helmetjs.github.io/docs/dont-sniff-mimetype) to keep clients from sniffing the MIME type | ✓ |
 | [referrerPolicy](https://helmetjs.github.io/docs/referrer-policy) to hide the Referer header |  |
 | [xssFilter](https://helmetjs.github.io/docs/xss-filter) adds some small XSS protections | ✓ |
 
You can see more in [the documentation](https://helmetjs.github.io/docs/).


