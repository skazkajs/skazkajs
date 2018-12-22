# Server Express Wrapper

Use:

    wrapper(context, helmet(options));
    
Or

    wrapper(helmet(options))(context);
    
As app module:

    app.then(wrapper(helmet(options)));
    
Or

    app.all([
      ...
      wrapper(helmet(options)),
      ...
    ]);
