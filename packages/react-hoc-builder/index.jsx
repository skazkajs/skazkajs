import React from 'react';

const wrapper = (WrapperComponent, wrapperProps = {}, Component) => () => (
  <WrapperComponent {...wrapperProps}>
    <Component />
  </WrapperComponent>
);

const hocBuilder = (WrapperComponent, wrapperProps, Component) => {
  if (!WrapperComponent) {
    throw new Error('WrapperComponent should be set!');
  }

  return Component
    ? wrapper(WrapperComponent, wrapperProps, Component)
    : (NewComponent) => {
      if (!NewComponent) {
        throw new Error('Component should be set!');
      }

      return wrapper(WrapperComponent, wrapperProps, NewComponent);
    };
};

export default hocBuilder;
