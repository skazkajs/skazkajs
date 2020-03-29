#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('fs');
const glob = require('glob');
const semver = require('semver');

const getFileData = (path) => {
  const data = JSON.parse(readFileSync(path, 'utf8'));

  data.oldVersion = data.version;

  return data;
};

const getFilesData = (directory) => {
  const data = {};

  glob.sync(`${directory}/**/package.json`).forEach((path) => {
    data[path] = getFileData(path);
  });

  return data;
};

const getDependency = (file) => ({
  ...(file.devDependencies || {}),
  ...(file.peerDependencies || {}),
  ...(file.dependencies || {}),
});

const getPackagesDependency = (packages) => {
  const data = {};

  Object.keys(packages).forEach((key) => {
    const { name, version } = packages[key];

    data[name] = `^${version}`;
  });

  return data;
};

const getUpdatedFiles = (files, dependency) => {
  let hasChanges = false;

  Object.keys(files).forEach((path) => {
    let changeVersion = false;

    const process = (dep) => {
      if (files[path][dep]) {
        Object.keys(files[path][dep]).forEach((name) => {
          const version = files[path][dep][name];

          if (dependency[name] !== version) {
            files[path][dep][name] = dependency[name]; // eslint-disable-line
            hasChanges = true;
            changeVersion = true;
          }
        });
      }
    };

    process('devDependencies');
    process('peerDependencies');
    process('dependencies');

    if (changeVersion) {
      files[path].version = semver.inc(files[path].oldVersion, 'patch'); // eslint-disable-line
      dependency[files[path].name] = files[path].version; // eslint-disable-line
    }
  });

  return hasChanges ? getUpdatedFiles(files, dependency) : files;
};

const writeFiles = (files) => {
  Object.keys(files).forEach((path) => {
    const data = files[path];

    delete data.oldVersion;

    writeFileSync(path, JSON.stringify(data, null, 2));
  });
};

(async () => {
  try {
    const main = getFileData('package.json');
    const packages = getFilesData('packages');
    const workspace = getFilesData('workspace');

    const dependency = { ...getDependency(main), ...getPackagesDependency(packages) };

    writeFiles(getUpdatedFiles(packages, dependency));
    writeFiles(getUpdatedFiles(workspace, dependency));
  } catch (e) {
    console.error(e.message); // eslint-disable-line

    process.exit(1);
  }
})();
