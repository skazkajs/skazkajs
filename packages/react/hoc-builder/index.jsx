import React from 'react';

const wrapper = (
  WrapperComponent,
  wrapperProps = {},
  childrenProps = null,
  Component,
) => (props) => {
  if (childrenProps) {
    return (
      <WrapperComponent {...wrapperProps} {...props}>
        {(...localProps) => <Component {...props} {...childrenProps(...localProps)} />}
      </WrapperComponent>
    );
  }

  return (
    <WrapperComponent {...wrapperProps} {...props}>
      <Component {...props} />
    </WrapperComponent>
  );
};

const hocBuilder = (WrapperComponent, wrapperProps, childrenProps, Component) => {
  if (!WrapperComponent) {
    throw new Error('WrapperComponent should be set!');
  }

  return Component
    ? wrapper(WrapperComponent, wrapperProps, childrenProps, Component)
    : (NewComponent) => {
      if (!NewComponent) {
        throw new Error('Component should be set!');
      }

      return wrapper(WrapperComponent, wrapperProps, childrenProps, NewComponent);
    };
};

export default hocBuilder;
