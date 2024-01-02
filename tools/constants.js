/**
 * Defines some constants shared by build scripts
 */

const path = require('path');

const SRC_CORE = 'GM_selenium_bin.js';
const SRC_CORE_MAP = 'GM_selenium_bin.js.map';
const SRC_ALL = 'GM_selenium_all_bin.js';
const SRC_ALL_MAP = 'GM_selenium_all_bin.js.map';

const DEST_CORE = 'GM_selenium.js';
const DEST_CORE_MAP = 'GM_selenium.js.map';
const DEST_ALL = 'GM_selenium_all.js';
const DEST_ALL_MAP = 'GM_selenium_all.js.map';

module.exports = {
    srcCore: path.resolve(__dirname, '..', 'dist', 'bin', 'src', SRC_CORE),
    srcCoreMap: path.resolve(__dirname, '..', 'dist', 'bin', 'src', SRC_CORE_MAP),
    srcAll: path.resolve(__dirname, '..', 'dist', 'bin', 'src', SRC_ALL),
    srcAllMap: path.resolve(__dirname, '..', 'dist', 'bin', 'src', SRC_ALL_MAP),
    destCore: path.resolve(__dirname, '..', 'dist', DEST_CORE),
    destCoreMap: path.resolve(__dirname, '..', 'dist', DEST_CORE_MAP),
    destAll: path.resolve(__dirname, '..', 'dist', DEST_ALL),
    destAllMap: path.resolve(__dirname, '..', 'dist', DEST_ALL_MAP),
};
