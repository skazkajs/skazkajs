const debug = require('debug')('skazka:server:static:stats');

const { stat } = require('mz/fs');
const { resolve } = require('path');

module.exports = async (index, path) => {
  let newPath = path;
  let stats = await stat(newPath);
  debug('Stats: %O', stats);

  if (stats.isDirectory()) {
    debug('Path is directory');

    newPath = resolve(newPath, index);
    debug('Path: %s', newPath);

    stats = await stat(newPath);
    debug('Stats: %O', stats);
  }

  debug('New path:', newPath);

  stats.path = newPath;

  return stats;
};
