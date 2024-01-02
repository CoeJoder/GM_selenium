/**
 * Deletes the copies of compiled modules in ../dist/
 */

const fs = require('fs');
const constants = require('./constants');

[
  constants.destCore, 
  constants.destCoreMap, 
  constants.destAll, 
  constants.destAllMap,
].forEach(path => fs.rmSync(path, { force: true }));
