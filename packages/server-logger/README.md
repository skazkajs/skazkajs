# Server Logger

It helps to work with logs.


[![NPM](https://nodei.co/npm/@skazka/server-logger.png)](https://npmjs.org/package/@skazka/server-logger)

## How to install

    npm i @skazka/server @skazka/server-logger
    
With yarn:

    yarn add @skazka/server @skazka/server-logger
    
Optionally you can add http server, error handler, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-response

## How to use

You can use any system for logging.
By default it's console.

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  response(),
]);
    
app.then(async (ctx) => {
  try {
    ctx.logger.info('some text');
    // some code with errors
  } catch(error) {
    ctx.logger.error(error);
  }
});
    
router.get('/data').then(async (ctx) => {
  try {
      ctx.logger.log('/url');
      // some code with errors
    } catch(error) {
      ctx.logger.error(error);
    }
            
  return ctx.response(); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

### log4js

**[log4js](https://www.npmjs.com/package/log4js)** - a framework to work with node.

    npm i log4js

With yarn

    yarn add log4js
    
```javascript
const log4js = require('log4js');
const log4jsLogger = log4js.getLogger();

app.all([
  ...
  logger(log4jsLogger),
  ...
]);
```

### winston

**[Winston](https://www.npmjs.com/package/winston)** - a logger for just about everything.

    npm i winston

With yarn

    yarn add winston
    
```javascript
const winston = require('winston');

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
 
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  winstonLogger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}


app.all([
  ...
  logger(winstonLogger),
  ...
]);
```
