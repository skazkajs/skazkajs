const { isDev } = require('../env');

const RESPONSE = { status: 'success' };

const SMOKE_EVENT = { isSmoke: true };

const defaultSmokeHandler = async (event, context) => {
  if (!isDev()) {
    console.log(event, context); // eslint-disable-line
  }

  return RESPONSE;
};

const isSmokeEvent = (event) => event && JSON.stringify(event) === JSON.stringify(SMOKE_EVENT);

module.exports = {
  RESPONSE,
  SMOKE_EVENT,
  defaultSmokeHandler,
  isSmokeEvent,
};
