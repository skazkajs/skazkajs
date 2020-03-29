import { createFactory } from 'react';

const mapProps = (propsMapper) => (BaseComponent) => {
  const factory = createFactory(BaseComponent);

  return (props) => factory(propsMapper(props));
};

export default mapProps;
