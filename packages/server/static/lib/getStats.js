const { stat } = require('mz/fs');
const { resolve } = require('path');

module.exports = async (index, path) => {
  let newPath = path;
  let stats = await stat(newPath);

  if (stats.isDirectory()) {
    newPath = resolve(newPath, index);

    stats = await stat(newPath);
  }

  stats.path = newPath;

  return stats;
};
