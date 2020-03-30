class Context {
  get(name) {
    return this[name];
  }

  set(name, value, rewrite = false) {
    if (this[name] && !rewrite) {
      throw new Error(`Value for ${name} already set!`);
    }

    this[name] = value;

    return this;
  }
}

module.exports = Context;
