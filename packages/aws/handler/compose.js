const compose = (...fns) => (
  fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)))
);

module.exports = compose;
