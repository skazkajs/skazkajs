# Skazka
A node.js platform for building web application.

TODO:
  
- response:
  - response.resolve(data = '', code = 200, contentType = 'text/plain');
  - response.reject ??? delete?
  - ctx.response = (new Response(ctx)).resolve;
  - return ctx.response('response text', code, 'content type');
  - update all docs
  - response in all tests

- request:
  - request module + update all request modules (body...)
  - put url to request
  - use in body parser, cookies, method override, router, ??graphql??
  - add setters/getters: ctx.request.set('method', 'POST'); ctx.request.get('method') === ctx.request.method
  - add getters/setters to server context (delete all setters like ctx.res = res => ctx.set('res', res)?
  - set(name, data, rewrite = false) { if(this[name] && !rewrite) {throw error exists!;} this[name] = data; return this; } => ctx.set('res', res).set('req', req);

- skazka module + preinstall hook + deprecate the module in npm

- split testing -> use lerna test to run test for each package (with own jest config + docker DBs)
- add lerna build

- release server
  - check each readme
  - check each package.json

- site

- front part
