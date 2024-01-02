/**
 * Copy the compiled modules from the Bazel output directory to ../dist/
 */

const fs = require('fs');
const constants = require('./constants');

const copyFile = (src, dest) => {
    if (fs.existsSync(src)) { 
        // explicitly delete file if it exists rather than rely on copy-overwrite behavior,
        // as a workaround for `copyFile` bug which affects network shares: https://github.com/nodejs/node/issues/37284
        if (fs.existsSync(dest)) {
            fs.rmSync(dest, { force: true });
        }
        fs.copyFileSync(src, dest);
    }
};

// copy the core module
copyFile(constants.srcCore, constants.destCore);
copyFile(constants.srcCoreMap, constants.destCoreMap);

// copy the core module, plus extensions
copyFile(constants.srcAll, constants.destAll);
copyFile(constants.srcAllMap, constants.destAllMap);
