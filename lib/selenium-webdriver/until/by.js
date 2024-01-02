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
 * @fileoverview Factory methods for the supported locator strategies.
 *
 * This is a modified subset of the original, with implementations provided by the Selenium atoms:
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/by.html}
 */

goog.module("webdriver.by");

// Selenium browser atoms
const byClassName = goog.require('bot.locators.className');
const byCss = goog.require('bot.locators.css');
const byId = goog.require('bot.locators.id');
const byLinkText = goog.require('bot.locators.linkText');
const byName = goog.require('bot.locators.name');
const byPartialLinkText = goog.require('bot.locators.partialLinkText');
const byTagName = goog.require('bot.locators.tagName');
const byXpath = goog.require('bot.locators.xpath');

/**
 * Short-hand expressions for the primary element locator strategies.
 * For example the following two statements are equivalent:
 *
 *     var e1 = driver.findElement(By.id('foo'));
 *     var e2 = driver.findElement({id: 'foo'});
 *
 * Care should be taken when using JavaScript minifiers (such as the
 * Closure compiler), as locator hashes will always be parsed using
 * the un-obfuscated properties listed.
 *
 * @typedef {(
 *     {className: string}|
 *     {css: string}|
 *     {id: string}|
 *     {js: string}|
 *     {linkText: string}|
 *     {name: string}|
 *     {partialLinkText: string}|
 *     {tagName: string}|
 *     {xpath: string})}
 */
var ByHash; // eslint-disable-line

/**
 * Describes a mechanism for locating an element on the page.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html|webdriver.By}
 */
class By {
  /**
   * @param {!string} using The name of the location strategy to use.
   * @param {!string} value The value to search for.
   * @param {!function(!(Document|Element)): IArrayLike<!Element>} findElements The locator implementation.
   * @private
   */
  constructor(using, value, findElements) {
    this.using = using;
    this.value = value;
    this.findElements = findElements;
  }

  /**
   * Locates elements that have a specific class name.
   * @export
   *
   * @param {string} name The class name to search for.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/2011/WD-html5-20110525/elements.html#classes
   * @see http://www.w3.org/TR/CSS2/selector.html#class-html
   */
  static className(name) {
    return new By('class name', name, (context) => byClassName.many(name, context));
  }

  /**
   * Locates elements using a CSS selector.
   * @export
   *
   * @param {string} selector The CSS selector to use.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/CSS2/selector.html
   */
  static css(selector) {
    return new By('css selector', selector, (context) => byCss.many(selector, context));
  }

  /**
   * Locates elements by the ID attribute. This locator uses the CSS selector
   * `*[id="$ID"]`, _not_ `document.getElementById`.
   * @export
   *
   * @param {string} id The ID to search for.
   * @return {!By} The new locator.
   */
  static id(id) {
    return new By('id', id, (context) => byId.many(id, context));
  }

  /**
   * Locates link elements whose
   * {@linkplain webdriver.WebElement#getText visible text} matches the given
   * string.
   * @export
   *
   * @param {string} text The link text to search for.
   * @return {!By} The new locator.
   */
  static linkText(text) {
    return new By('link text', text, (context) => byLinkText.many(text, context));
  }

  /**
   * Locates elements whose `name` attribute has the given value.
   * @export
   *
   * @param {string} name The name attribute to search for.
   * @return {!By} The new locator.
   */
  static nameAttribute(name) {
    return new By('name', name, (context) => byName.many(name, context));
  }
    
  /**
   * Locates link elements whose
   * {@linkplain webdriver.WebElement#getText visible text} contains the given
   * substring.
   * @export
   *
   * @param {string} text The substring to check for in a link's visible text.
   * @return {!By} The new locator.
   */
  static partialLinkText(text) {
    return new By('partial link text', text, (context) => byPartialLinkText.many(text, context));
  }

  /**
   * Locates elements with a given tag name.
   * @export
   *
   * @param {string} name The tag name to search for.
   * @return {!By} The new locator.
   */
  static tagName(name) {
    return new By('tag name', name, (context) => byTagName.many(name, context));
  }

  /**
   * Locates elements matching a XPath selector. Care should be taken when
   * using an XPath selector with a {@link Element} as WebDriver
   * will respect the context in the specified in the selector. For example,
   * given the selector `//div`, WebDriver will search from the document root
   * regardless of whether the locator was used with a WebElement.
   * @export
   *
   * @param {string} xpath The XPath selector to use.
   * @return {!By} The new locator.
   * @see http://www.w3.org/TR/xpath/
   */
  static xpath(xpath) {
    return new By('xpath', xpath, (context) => byXpath.many(xpath, context));
  }

  /** @override */
  toString() {
    // The static By.name() overrides this.constructor.name.  Shame...
    return `By(${this.using}, ${this.value})`;
  }
}

exports = { By };
