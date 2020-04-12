const axios = require('axios');

const { getParameter } = require('../../ssm');
const { getRegion, getStage, isDev } = require('../../helpers');

const errorHandler = (channel, options = {}) => (name) => async (error, payload = null) => {
  const {
    useSSM = false,
    ssmOptions = {},
  } = options;

  try {
    const channelUrl = useSSM ? await getParameter(channel, ssmOptions) : channel;

    const data = {
      name,
      stage: getStage(),
      region: getRegion(),
      error: (error && error.message) ? error.message : error,
      payload,
    };

    const text = JSON.stringify(data, null, 2);

    if (!isDev()) {
      await axios.post(channelUrl, { text });
    } else {
      console.error(text); // eslint-disable-line
    }
  } catch (e) {
    console.error(e); // eslint-disable-line
  }
};

module.exports = errorHandler;
