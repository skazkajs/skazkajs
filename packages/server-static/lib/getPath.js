const debug = require('debug')('skazka:server:static:path');

const resolvePath = require('resolve-path');
const { parse, normalize, resolve } = require('path');

module.exports = async (root, index, url) => {
  debug('Url:', url);

  let path = url.split('?')[0];

  path = path.substr(parse(path).root.length);

  path = decodeURIComponent(path);
  debug('Path: %s', path);

  const trailingSlash = path[path.length - 1] === '/';

  if (trailingSlash) {
    debug('Trailing slash');

    path += (index || 'index.html');

    debug('Path: %s', path);
  }

  if (!index && (!path || path.includes('index.html'))) {
    debug('ENOENT');

    const error = new Error();
    error.code = 'ENOENT';

    throw error;
  }

  const directory = normalize(resolve(root));
  debug('Directory: %s', directory);

  path = resolvePath(directory, path);
  debug('Path: %s', path);

  return path;
};
