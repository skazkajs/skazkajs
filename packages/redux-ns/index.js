const toConst = text => text.replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`).toUpperCase();

const getNameSpaceKey = (nameSpace, globalNameSpace, nameSpacePrefix) => (
  `${nameSpacePrefix}${globalNameSpace && `${globalNameSpace}/`}${nameSpace}`
);

const nameValidation = (name) => {
  if (name === 'type') {
    throw new Error('Action name should not be "type"! This can create a conflict with redux action creators.');
  }

  if (!name) {
    throw new Error('Action name should be set!');
  }
};

const getReducer = (types, defaultState) => (state = defaultState, action) => {
  if (Object.values(types).includes(action.type)) {
    const returnState = { ...state, ...action };

    delete returnState.type;

    return returnState;
  }

  return state;
};

class NS {
  constructor(nameSpace, options = {}) {
    const {
      connect = null,
      globalNameSpace = '',
      nameSpacePrefix = '@@',
      actionPostfix = 'Action',
      eventPostfix = 'Event',
      formPostfix = 'FormAction',
      inputPostfix = 'InputAction',
      transactionPostfix = 'Transaction',
      resetPostfix = 'Action',
      actionTypePostfix = '_ACTION',
      eventTypePostfix = '_EVENT',
      formTypePostfix = '_FORM',
      inputTypePostfix = '_INPUT',
      transactionTypePostfix = '_TRANSACTION',
      resetTypePostfix = '_RESET',
    } = options;

    this.nameSpace = nameSpace;
    this.connect = connect;
    this.globalNameSpace = globalNameSpace;
    this.nameSpacePrefix = nameSpacePrefix;
    this.actionPostfix = actionPostfix;
    this.eventPostfix = eventPostfix;
    this.formPostfix = formPostfix;
    this.inputPostfix = inputPostfix;
    this.transactionPostfix = transactionPostfix;
    this.resetPostfix = resetPostfix;
    this.actionTypePostfix = actionTypePostfix;
    this.eventTypePostfix = eventTypePostfix;
    this.formTypePostfix = formTypePostfix;
    this.inputTypePostfix = inputTypePostfix;
    this.transactionTypePostfix = transactionTypePostfix;
    this.resetTypePostfix = resetTypePostfix;

    this.actions = {};
    this.types = {};
    this.defaultState = {};

    this.nameSpaceKey = getNameSpaceKey(this.nameSpace, this.globalNameSpace, this.nameSpacePrefix);
  }

  addAction(name, defaultValue = null) {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.actionTypePostfix}`;
    const actionKey = `${name}${this.actionPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Action with the same name already exists!');
    }

    if (this.defaultState[name]) {
      throw new Error('Other kind of action with the same name already exists!');
    }

    this.defaultState[name] = defaultValue;
    this.types[typeKey] = type;
    this.actions[actionKey] = payload => ({ type, [name]: payload });
  }

  addEventAction(name) {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.eventTypePostfix}`;
    const actionKey = `${name}${this.eventPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Event action with the name already exists!');
    }

    this.types[typeKey] = type;
    this.actions[actionKey] = () => ({ type });
  }

  addFormAction(name) {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.formTypePostfix}`;
    const actionKey = `${name}${this.formPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Form action with the same name already exists!');
    }

    this.types[typeKey] = type;
    this.actions[actionKey] = (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }

      return { type };
    };
  }

  addInputAction(name, defaultValue = null) {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.inputTypePostfix}`;
    const actionKey = `${name}${this.inputPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Input action with the same name already exists!');
    }

    if (this.defaultState[name]) {
      throw new Error('Other kind of action with the same name already exists!');
    }

    this.defaultState[name] = defaultValue;
    this.types[typeKey] = type;
    this.actions[actionKey] = (event) => {
      let payload = defaultValue;
      if (event && event.target && event.target.value !== undefined) {
        const { target: { value } } = event;
        payload = value;
      }

      return { type, [name]: payload };
    };
  }

  addTransactionAction(name) {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.transactionTypePostfix}`;
    const actionKey = `${name}${this.transactionPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Input action with the same name already exists!');
    }

    this.types[typeKey] = type;
    this.actions[actionKey] = (data = {}) => {
      Object.keys(data).forEach((key) => {
        if (this.defaultState[key] === undefined) {
          throw new Error('Transaction action can set only existing keys!');
        }
      });

      return { type, ...data };
    };
  }

  addResetAction(name = 'clear') {
    nameValidation(name);

    const typeKey = `${toConst(name)}${this.resetTypePostfix}`;
    const actionKey = `${name}${this.resetPostfix}`;
    const type = `${this.nameSpaceKey}/${typeKey}`;

    if (this.types[typeKey] === type) {
      throw new Error('Reset action with the name already exists!');
    }

    this.types[typeKey] = type;
    this.actions[actionKey] = () => ({ type, ...this.defaultState });
  }

  getNameSpace() {
    return `${this.nameSpaceKey}/${toConst(this.nameSpace)}`;
  }

  getTypes() {
    return this.types;
  }

  getActions() {
    return this.actions;
  }

  getReducer() {
    return getReducer(this.types, this.defaultState);
  }

  getContainer() {
    if (!this.connect) {
      throw new Error('React-Redux connect should be set!');
    }

    return this.connect(this.getMapStateToProps, this.getMapDispatchToProps);
  }

  getMapStateToProps(state) {
    return state[this.nameSpace];
  }

  getMapDispatchToProps() {
    return this.actions;
  }
}

export default NS;
