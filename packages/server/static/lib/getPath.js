const resolvePath = require('resolve-path');
const { parse, normalize, resolve } = require('path');

module.exports = async (root, index, url) => {
  let path = url.split('?')[0];

  path = path.substr(parse(path).root.length);

  path = decodeURIComponent(path);

  const trailingSlash = path[path.length - 1] === '/';

  if (trailingSlash) {
    path += (index || 'index.html');
  }

  if (!index && (!path || path.includes('index.html'))) {
    const error = new Error();
    error.code = 'ENOENT';

    throw error;
  }

  const directory = normalize(resolve(root));

  path = resolvePath(directory, path);

  return path;
};
