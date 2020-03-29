/* istanbul ignore file */
const { configure } = require('enzyme'); // eslint-disable-line
const Adapter = require('enzyme-adapter-react-16'); // eslint-disable-line

configure({ adapter: new Adapter() });
