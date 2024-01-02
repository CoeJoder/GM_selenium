/**
 * @fileoverview The core `GM_selenium` module, plus the `until` module and `By` class.
 */

goog.module('GM_selenium_all');

const misc = goog.require('misc');
const until = goog.require('webdriver.until');
const { By } = goog.require('webdriver.by');
const { GM_selenium } = goog.require('GM_selenium');

const assignAs = misc.assignAs;
assignAs(GM_selenium, 'By', By);
assignAs(GM_selenium, 'until', until);

exports = {
  GM_selenium,
};
