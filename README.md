# Skazka
A node.js platform for building web application.

TODO:

- request:
  - request module + update all request modules (body...)
  - put url to request
  - use in body parser, cookies, method override, router, ??graphql??
  - add setters/getters: ctx.request.set('method', 'POST'); ctx.request.get('method') === ctx.request.method
  - add getters/setters to server context (delete all setters like ctx.res = res => ctx.set('res', res)?
  - ctx.module => ctx.get('module') everywhere!

- skazka module + preinstall hook + deprecate the module in npm

- split testing -> use lerna test to run test for each package (with own jest config + docker DBs)
- add lerna build

- release server
  - check each readme
  - check each package.json
  - add authors to p.json
  - relay + main/unpkg/module/typings ??? typescript docs ???

- site

- front part
