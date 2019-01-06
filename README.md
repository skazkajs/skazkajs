# Skazka
A node.js platform for building web application

TODO:
  
- response.resolve(data = '', code = 200, contentType = 'text/plain');
- response.reject ??? delete?
- ctx.response = (new Response(ctx)).resolve;
- return ctx.response('response text', code, 'content type');
- update all docs

- skazka module + preinstall hook + deprecate the module in npm

- response in all tests
  
- request module + update all request modules (body...)

- check each readme
- check each package.json

- split testing -> use lerna test to run test for each package (with own jest config + docker DBs)
- add lerna build
