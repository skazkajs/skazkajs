# Server Mongoose

Skazka Server Promise based Mongoose client.

[![NPM](https://nodei.co/npm/@skazka/server-mongoose.png)](https://npmjs.org/package/@skazka/server-mongoose)

## How to install

    npm i @skazka/server @skazka/server-mongoose
    
With yarn:

    yarn add @skazka/server @skazka/server-mongoose
    
Optionally you can add http server, error handler, logger, router and response:

    npm i @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response
      
With yarn:

    yarn add @skazka/server-http @skazka/server-router @skazka/server-error @skazka/server-logger @skazka/server-response

## How to use

### Config

#### config/default.json

```json
{
  "mongoose": {
    "uri": "mongodb://localhost/test",
    "parameters": {
      "useNewUrlParser": true
    }
  }
}
```

See https://mongoosejs.com/docs/connections.html.

### Server module

```javascript
const App = require('@skazka/server');
const Router = require('@skazka/server-router');

const mongoose = require('@skazka/server-mongoose');
        
const error = require('@skazka/server-error');
const logger = require('@skazka/server-logger');
        
const response = require('@skazka/server-response');
        
const server = require('@skazka/server-http');
        
const app = new App();
const router = new Router();
        
app.all([
  error(),
  logger(),
  mongoose(),
  response(),
]);
    
router.get('/data').then(async (ctx) => {
  const { Schema } = ctx.mongoose;
          
  const UserSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
  });
          
  const User = mongoose.model('user', UserSchema);
            
  const testUser = new User({ name: 'Test' });
          
  await testUser.save();
          
  // const user = await User.findOne({ _id: testUser._id });
          
  await testUser.remove();
  
  const users = await User.find({ name: 'Test' });
            
  return ctx.response(users); 
});
        
app.then(router.resolve());
        
server.createHttpServer(app);
```

### Any other module

```javascript
const mongoose = require('@skazka/server-mongoose/mongoose');

const { Schema } = mongoose;
    
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
});
        
const User = mongoose.model('user', UserSchema);
    
module.exports = User;
```
