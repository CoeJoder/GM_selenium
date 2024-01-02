// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileoverview Defines common conditions for use with
 * {@link webdriver.wait WebDriver wait}.
 *
 * Sample usage:
 *
 *     await webdriver.wait({
 *         condition: until.elementVisible(By.name('button')),
 *         timeout: 3000
 *     }).click();
 *
 *     await webdriver.wait({
 *         condition: until.titleIs('Foobar')
 *     });
 *
 * To define a custom condition, simply call WebDriver.wait with a function
 * that will eventually return a truthy-value (neither null, undefined, false,
 * 0, or the empty string):
 *
 *     await webdriver.wait({
 *         condition: () => document.title === 'webdriver - Google Search',
 *         timeout: 1000
 *     });
 * 
 * This is a modified subset of the original:
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html}
 */

goog.module("webdriver.until");

// Selenium browser atom
const botDom = goog.require('bot.dom');

const googArray = goog.require('goog.array');
const { By } = goog.require("webdriver.by");
const { Condition, ElementCondition } = goog.require('webdriver');

/**
 * Search for multiple elements on the page. Refer to the documentation on
 * [webdriver.findElement(by)]{@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html#findElement}
 * for information on element locator strategies.
 *
 * @param {!(By|function(*): !(Element|IArrayLike<!Element>))} locator The locator to use.
 * @param {*} context The search context.
 * @return {!IThenable<!IArrayLike<!Element>>} A promise that will resolve to an array-like collection of Elements.
 */
async function findElements(locator, context) {
  if (typeof locator === 'function') {
    let result = await locator(context);
    if (result instanceof Element) {
      result = [result];
    } else if (goog.isArrayLike(result)) {
      result = googArray.filter(result, function (item) {
        return item instanceof Element;
      });
    } else {
      result = [];
    }
    return result;
  } else {
      let result = (/** @type {By} */ (locator)).findElements(/** @type {!(Document|Element)} */ (context));
      if (!result) {
        result = [];
      }
      return result;
  }
}

/**
 * Creates a condition that will loop until an element is found with the given locator.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#elementLocated|webdriver.until.elementLocated}
 *
 * @param {!(By|function(*): !(Element|IArrayLike<!Element>))} locator The locator to use.
 * @return {!ElementCondition} The new condition.
 */
function elementLocated(locator) {
  let locatorStr = typeof locator === 'function' ? 'by function()' : locator + '';
  return new ElementCondition(
      'for element to be located ' + locatorStr, 
      /**
       * @param {*} context 
       * @returns {!IThenable<Element>} The located element.
       */
      async function (context) {
    const elements = await findElements(locator, context);
    return elements.length > 0 ? elements[0] : null;
  });
}

/**
 * Creates a condition that will loop until at least one element is found with the given locator.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#elementsLocated|webdriver.until.elementsLocated}
 *
 * @param {!(By|function(*): !(Element|IArrayLike<!Element>))} locator The locator to use.
 * @return {!Condition<!(Document|Element), !(IThenable<IArrayLike<!Element>>)>} The new condition.
 */
function elementsLocated(locator) {
  let locatorStr = typeof locator === 'function' ? 'by function()' : locator + '';
  return new Condition(
      'for at least one element to be located ' + locatorStr,
      /**
       * @param {!(Document|Element)} context The search context.
       * @returns {!IThenable<IArrayLike<!Element>>} The located elements, or null.
       */
      async function (context) {
    const elements = await findElements(locator, context);
    return elements.length > 0 ? elements : null;
  });
}

/**
 * Creates a condition that will wait for the given element to become visible.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#elementIsVisible|webdriver.until.elementIsVisible}
 *
 * @param {!Element} element The element to test.
 * @return {!ElementCondition} The new condition.
 */
function elementIsVisible(element) {
  return new ElementCondition(
      'until element is visible',
      /**
       * @param {!Element} context element to test.
       * @returns {!IThenable<Element>} The element if visible, or null.
       */
      async function (context) {
    return botDom.isShown(element) ? element : null;
  });
}

/**
 * Creates a condition that will wait for the given element to be in the DOM, yet not visible to the user.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/until.html#elementIsNotVisible|webdriver.until.elementIsNotVisible}
 *
 * @param {!Element} element The element to test.
 * @return {!ElementCondition} The new condition.
 */
function elementIsNotVisible(element) {
  return new ElementCondition('until element is not visible', async function (context) {
    return botDom.isShown(element) ? null : element;
  });
}

// prevent compiler renaming
exports['elementLocated'] = elementLocated;
exports['elementsLocated'] = elementsLocated;
exports['elementIsVisible'] = elementIsVisible;
exports['elementIsNotVisible'] = elementIsNotVisible;
