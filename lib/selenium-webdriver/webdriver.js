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
// KIND, either express or implied. s See the License for the
// specific language governing permissions and limitations
// under the License.

/**
 * @fileoverview The heart of the WebDriver JavaScript API.
 * 
 * This is a modified subset of the original:
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html}
 */

goog.module('webdriver');

const { TimeoutError } = goog.require('webdriver.error');
const { isPromise } = goog.require('webdriver.promise');

/**
 * Defines a condition for use with {@link wait}.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Condition.html|webdriver.Condition}
 * @template T, V
 */
class Condition {
  /**
   * @param {string}          message A descriptive error message. Should complete the sentence "Waiting [...]".
   * @param {function(!T): V} fn      The condition function to evaluate on each iteration of the wait loop.
   */
  constructor(message, fn) {
    this.message = message;
    this.fn = fn;
  }

  /**
   * @return {string} A description of this condition.
   */
  description() {
    return 'Waiting ' + this.message;
  }
}

/**
 * Defines a condition that will result in an {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElementCondition.html|webdriver.WebElementCondition}
 * @template T
 * @extends {Condition<T, Element>}
 */
class ElementCondition extends Condition {
  /**
   * @param {string} message A descriptive error message. Should complete the sentence "Waiting [...]".
   * @param {function(!T): (Element|IThenable<Element>)} fn The condition function to
   *      evaluate on each iteration of the wait loop.
   */
  constructor(message, fn) {
    super(message, fn);
  }
}

/**
 * A promise that will be fulfilled with an {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}.
 * @implements {IThenable<!Element>}
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElementPromise.html|webdriver.WebElementPromise}
 */
class ElementPromise {
  /**
   * @param {!Promise<!Element>} el A promise that will resolve to the promised element.
   */
  constructor(el) {
    /** @override */
    this.then = el.then.bind(el);

    this.catch = el.catch.bind(el);
  }
}

/**
 * Resolves a wait message from either a function or a string.
 * @see {@link https://github.com/SeleniumHQ/selenium/blob/d912be8f325d3bed9758140b50599ee0619f1929/javascript/node/selenium-webdriver/lib/webdriver.js#L221|webdriver.resolveWaitMessage}
 *
 * @param {(string|function() : string)} [message] An optional message to use if the wait times out.
 * @return {string} The resolved message.
 */
function resolveWaitMessage(message) {
  return message ? `${typeof message === 'function' ? message() : message}\n` : '';
}

/**
 * @description Waits for a condition to evaluate to a "truthy" value. The condition may be specified by a
 * {@link Condition}, as a custom function, or as any promise-like thenable.
 *
 * For a {@link Condition} or function, the wait will repeatedly evaluate the condition until it returns a truthy
 * value. If any errors occur while evaluating the condition, they will be allowed to propagate. In the event a
 * condition returns a Promise, the polling loop will wait for it to be resolved and use the resolved value for
 * whether the condition has been satisfied. The resolution time for a promise is always factored into whether a
 * wait has timed out.
 *
 * If the provided condition is an {@link ElementCondition}, then the wait will return a
 * {@link ElementPromise} that will resolve to the element that satisfied the condition.
 *
 * @example
 * (async ({wait, until, By}) => {
 *     await wait({
 *         condition: until.elementLocated(By.css('button')),
 *         input: document
 *     }).click();
 * })(webdriver);
 *
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html#wait|webdriver.wait}
 * @see {@link https://www.selenium.dev/selenium/docs/api/java/org/openqa/selenium/support/ui/FluentWait.html|webdriver.FluentWait}
 * 
 * Param object:
 * [param.condition]       The condition to wait on, defined as a promise, {@link Condition} object,
 *      or a function to evaluate as a condition.
 * [param.input]           The input value to pass to the evaluated conditions.
 * [param.timeout=0]       The duration in milliseconds, how long to wait for the condition to be true.
 * [param.pollTimeout=200] The duration in milliseconds, how long to wait between polling the condition.
 * [param.message]         An optional message to use if the wait times out.
 *
 * @template T
 * @template V
 * @param {{condition: (IThenable<V>|Condition<T, V>|function(T): V), input: (T|undefined), timeout: (number|undefined), pollTimeout: (number|undefined), message: (string|undefined|function(): string)}} obj
 * @return {!(IThenable<V>|ElementPromise)} A promise that will be resolved with the first truthy value returned
 *      by the condition function, or rejected if the condition times out. If the input input condition is an
 *      instance of an {@link ElementCondition}, the returned value will be an {@link ElementPromise}.
 * @throws {TypeError} if the provided `condition` is not a valid type.
 * @suppress {reportUnknownTypes} allow generic parameter
 */
// function wait({ condition, input = undefined, timeout = 0, pollTimeout = 200, message = undefined }) {
function wait(obj) {
  // unfortunately, GCC generics & parameter destructuring support are incomplete, so this is necessary
  // to prevent compiler renaming (at the cost of some type checking)
  let condition = obj['condition'];
  let input = obj['input'];
  let timeout = obj['timeout'];
  let pollTimeout = obj['pollTimeout'];
  let message = obj['message'];

  if (typeof timeout === 'undefined') {
    timeout = 0;
  }
  else if (typeof timeout !== 'number' || timeout < 0) {
    throw new TypeError('timeout must be a number >= 0: ' + timeout);
  }

  if (typeof pollTimeout === 'undefined') {
    pollTimeout = 200;
  }
  else if (typeof pollTimeout !== 'number' || pollTimeout < 0) {
    throw new TypeError('pollTimeout must be a number >= 0: ' + pollTimeout);
  }

  if (isPromise(condition)) {
    let pCondition = /** @type {!Promise} */ (condition);
    return new Promise((resolve, reject) => {
      if (!timeout) {
        resolve(pCondition);
        return;
      }
      let start = Date.now();
      let timer = setTimeout(function () {
        timer = null;
        try {
          let timeoutMessage = resolveWaitMessage(message);
          reject(
            new TimeoutError(`${timeoutMessage}Timed out waiting for promise to resolve after ${Date.now() - start}ms`)
          );
        } catch (ex) {
          reject(
            new TimeoutError(`${ex.message}\nTimed out waiting for promise to resolve after ${Date.now() - start}ms`)
          );
        }
      }, timeout);
      const clearTimer = () => timer && clearTimeout(timer);

      pCondition.then(
        function (value) {
          clearTimer();
          resolve(value);
        },
        function (error) {
          clearTimer();
          reject(error);
        }
      );
    });
  }

  let fn;
  if (condition instanceof Condition) {
    message = message || condition.description();
    fn = condition.fn;
  } else if (typeof condition === 'function') {
    fn = condition;
  } else {
    throw new TypeError('Wait condition must be a promise-like object, function, or a Condition object');
  }

  function evaluateCondition() {
    return new Promise((resolve, reject) => {
      try {
        resolve(fn(input));
      } catch (ex) {
        reject(ex);
      }
    });
  }
  let pResult = new Promise((resolve, reject) => {
    const startTime = Date.now();
    const pollCondition = async () => {
      evaluateCondition().then(function (value) {
        const elapsed = Date.now() - startTime;
        if (value) {
          resolve(value);
        } else if (timeout && elapsed >= timeout) {
          try {
            let timeoutMessage = resolveWaitMessage(message);
            reject(new TimeoutError(`${timeoutMessage}Wait timed out after ${elapsed}ms`));
          } catch (ex) {
            reject(new TimeoutError(`${ex.message}\nWait timed out after ${elapsed}ms`));
          }
        } else {
          setTimeout(pollCondition, pollTimeout);
        }
      }, reject);
    };
    pollCondition();
  });
  if (condition instanceof ElementCondition) {
    return new ElementPromise(
      pResult.then(function (value) {
        if (!(value instanceof Element)) {
          throw new TypeError(
            'ElementCondition did not resolve to a Element: ' + Object.prototype.toString.call(value)
          );
        }
        return value;
      })
    );
  }
  return pResult;
}

exports = {
  wait,
  Condition,
  ElementCondition,
  ElementPromise,
};