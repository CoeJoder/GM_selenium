/**
 * @fileoverview The core GM_selenium module.
 */

goog.module('GM_selenium');

const misc = goog.require('misc');
const { Condition, ElementCondition, ElementPromise, wait } = goog.require('webdriver');
const { TimeoutError, WebDriverError } = goog.require('webdriver.error');

// non-clobbering global init
const GM_selenium = /** @type {Object<string, ?>} */ (window['GM_selenium']) || {};
window['GM_selenium'] = GM_selenium;

const assignAs = misc.assignAs;
assignAs(GM_selenium, 'Condition', Condition);
assignAs(GM_selenium, 'ElementCondition', ElementCondition);
assignAs(GM_selenium, 'ElementPromise', ElementPromise);
assignAs(GM_selenium, 'wait', wait);
assignAs(GM_selenium, 'TimeoutError', TimeoutError);
assignAs(GM_selenium, 'WebDriverError', WebDriverError);

exports = {
  GM_selenium,
};
