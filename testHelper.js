/* istanbul ignore file */
require('@babel/polyfill'); //  eslint-disable-line
require('@babel/register'); //  eslint-disable-line
require('ignore-styles'); //  eslint-disable-line
// TODO import files with configs
const { configure } = require('enzyme'); //  eslint-disable-line
const Adapter = require('enzyme-adapter-react-16'); //  eslint-disable-line

const axios = require('axios'); //  eslint-disable-line
const httpAdapter = require('axios/lib/adapters/http'); //  eslint-disable-line

const chai = require('chai'); //  eslint-disable-line
const dirtyChai = require('dirty-chai'); //  eslint-disable-line

chai.use(dirtyChai);

axios.defaults.host = process.env.AXIOS_HOST;
axios.defaults.adapter = httpAdapter;

configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');

const exposedProperties = ['window', 'navigator', 'document'];

const { window } = new JSDOM('', { url: 'http://localhost' });
global.document = window.document;
global.window = window;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};

global.localStorage = {
  setItem() {},
};

global.documentRef = document;

window.matchMedia = (query) => {
  const queryMap = {
    '(min-width: 768px)': () => window.innerWidth >= 768,
    '(max-width: 767px)': () => window.innerWidth < 768,
    '(max-width: 599px)': () => window.innerWidth < 599,
  };

  const queryValue = queryMap[query];
  const matches = queryValue ? queryValue() : false;

  return {
    matches,
    addListener: () => {},
    removeListener: () => {},
  };
};

const consoleError = console.error; // eslint-disable-line

console.error = (firstMessage, ...rest) => { // eslint-disable-line
  if (firstMessage && firstMessage.startsWith && firstMessage.startsWith('Warning:')) {
    throw new Error(`Unexpected React Warning: ${firstMessage}`);
  }

  return consoleError(firstMessage, ...rest);
};

process.once('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.stack}`); // eslint-disable-line
  process.exit(1);
});
