# Server cookies parser

Parse **Cookie** header and populate ctx.request.cookies with an object keyed by the cookie names. 

## How to install

    npm i @skazka/server @skazka/server-cookies
  

## How to use

    const App = require('@skazka/server');
    const cookies = require('@skazka/server-cookie');
    
    const app = new App();
    
    app.then(cookies());
    
    app.then(async (ctx) => {
        console.log(ctx.request.cookies);
    });
