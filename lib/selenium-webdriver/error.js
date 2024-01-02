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
 * @fileoverview WebDriver-related errors.
 * 
 * This is a modified subset of the original:
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/error.html}
 */

goog.module("webdriver.error");

/**
 * The base WebDriver error type. This error type is only used directly when a
 * more appropriate category is not defined for the offending error.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_WebDriverError.html}
 */
class WebDriverError extends Error {
  /** @param {string=} opt_error the error message, if any. */
  constructor(opt_error) {
    super(opt_error);

    /** @override */
    this.name = this.constructor.name;

  }

  // /** @override */
  // toString() {
  //   return `${this.name}: '${this.message}'`;
  // }
}

/**
 * An operation did not complete before its timeout expired.
 * @see {@link https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/lib/error_exports_TimeoutError.html}
 */
class TimeoutError extends WebDriverError {
  /** @param {string=} opt_error the error message, if any. */
  constructor(opt_error) {
    super(opt_error);

    // prevent display of setTimeout call chains
    this.stack = '';
  }
}

exports = { WebDriverError, TimeoutError };
