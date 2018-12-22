# Server Module Builder

Import:

    const moduleBuilder = require('@skazka/server-module');

Create simple module:
   
    module.exports = moduleBuilder((context) => {
      // use context
    });

Create module with options:
    
    module.exports = moduleBuilder((context, options) => {
      // use context and options
    });

Or

    module.exports = moduleBuilder((context, option1, option2) => {
      // use context and options
    });

Use

    app.then(module())
    app.then(module(options))
    app.then(module(option1, option2))
    
Or

    await module(context)
    await module(context, options)
    await module(context, option1, option2)
