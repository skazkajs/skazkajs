# Server Method Override

Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

[![NPM](https://nodei.co/npm/@skazka/server-method-override.png)](https://npmjs.org/package/@skazka/server-method-override)

## How to install

    npm i @skazka/server @skazka/server-method-override
    
With yarn:

    yarn add @skazka/server @skazka/server-method-override
    
Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const methodOverride = require('@skazka/server-method-override');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  methodOverride(),
  response(),
]);
    
app.then(async (ctx) => {
  // ctx.req.method
  // it works for each request
});
    
router.get('/data').then(async (ctx) => {
  return ctx.response(ctx.req.method); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

## API

**NOTE** It is very important that this module is used **before** any module that
needs to know the method of the request.

### methodOverride(getter, options)

Create a new middleware function to override the `req.method` property with a new
value. This value will be pulled from the provided `getter`.

- `getter` - The getter to use to look up the overridden request method for the request. (default: `X-HTTP-Method-Override`)
- `options.methods` - The allowed methods the original request must be in to check for a method override value. (default: `['POST']`)

If the found method is supported by node.js core, then `req.method` will be set to
this value, as if it has originally been that value. The previous `req.method`
value will be stored in `req.originalMethod`.

#### getter

This is the method of getting the override value from the request. If a function is provided,
the `req` is passed as the first argument, the `res` as the second argument and the method is
expected to be returned. If a string is provided, the string is used to look up the method
with the following rules:

- If the string starts with `X-`, then it is treated as the name of a header and that header
  is used for the method override. If the request contains the same header multiple times, the
  first occurrence is used.
- All other strings are treated as a key in the URL query string.

#### options.methods

This allows the specification of what methods(s) the request *MUST* be in in order to check for
the method override value. This defaults to only `POST` methods, which is the only method the
override should arrive in. More methods may be specified here, but it may introduce security
issues and cause weird behavior when requests travel through caches. This value is an array
of methods in upper-case. `null` can be specified to allow all methods.

## Examples

### override using a header

To use a header to override the method, specify the header name
as a string argument to the `methodOverride` function. To then make
the call, send  a `POST` request to a URL with the overridden method
as the value of that header. This method of using a header would
typically be used in conjunction with `XMLHttpRequest` on implementations
that do not support the method you are trying to use.

```js
const App = require('@skazka/server');
const methodOverride = require('@skazka/server-method-override');

const app = new App();

// override with the X-HTTP-Method-Override header in the request
app.then(methodOverride('X-HTTP-Method-Override'));
```

Example call with header override using `XMLHttpRequest`:

```js
var xhr = new XMLHttpRequest()
xhr.onload = onload
xhr.open('post', '/resource', true)
xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE')
xhr.send()

function onload () {
  alert('got response: ' + this.responseText)
}
```

### override using a query value

To use a query string value to override the method, specify the query
string key as a string argument to the `methodOverride` function. To
then make the call, send  a `POST` request to a URL with the overridden
method as the value of that query string key. This method of using a
query value would typically be used in conjunction with plain HTML
`<form>` elements when trying to support legacy browsers but still use
newer methods.

```js
const App = require('@skazka/server');
const methodOverride = require('@skazka/server-method-override');

const app = new App();

// override with POST having ?_method=DELETE
app.then(methodOverride('_method'))
```

Example call with query override using HTML `<form>`:

```html
<form method="POST" action="/resource?_method=DELETE">
  <button type="submit">Delete resource</button>
</form>
```

### multiple format support

```js
const App = require('@skazka/server');
const methodOverride = require('@skazka/server-method-override');

const app = new App();

// override with different headers; last one takes precedence
app.all([
  methodOverride('X-HTTP-Method'), //          Microsoft
  methodOverride('X-HTTP-Method-Override'), // Google/GData
  methodOverride('X-Method-Override'), //      IBM
]);
```

### custom logic

You can implement any kind of custom logic with a function for the `getter`. The following
implements the logic for looking in `req.body` that was in `method-override@1`:

```js
const App = require('@skazka/server');
const methodOverride = require('@skazka/server-method-override');
const bodyParser = require('@skazka/server-body-parser');

const app = new App();

// NOTE: when using req.body, you must fully parse the request body
//       before you call methodOverride() in your middleware stack,
//       otherwise req.body will not be populated.
app.then(bodyParser.urlencoded())
app.then(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}))
```

Example call with query override using HTML `<form>`:

```html
<!-- enctype must be set to the type you will parse before methodOverride() -->
<form method="POST" action="/resource" enctype="application/x-www-form-urlencoded">
  <input type="hidden" name="_method" value="DELETE">
  <button type="submit">Delete resource</button>
</form>
```
