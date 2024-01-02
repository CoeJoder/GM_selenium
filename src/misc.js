/**
 * @fileoverview Miscellaneous utility functions.
 */

goog.module('misc');

/**
 * Assign an object to a dict using the given key name.  
 * If the object is a function, its `name` property is changed along the way.
 * 
 * Useful for (mostly) undoing GCC's aggressive renaming of top-level functions & classes,
 * as the export annotation cannot be used in those cases.
 * 
 * @param {Object} dict The object being assigned to.
 * @param {string} name The key name.
 * @param {?} obj The object being assigned and possibly renamed.
 * @suppress {reportUnknownTypes}
 */
function assignAs(dict, name, obj) {
  dict[name] = (typeof obj === 'function') ? 
      Object.defineProperty(obj, 'name', { value: name }) :
      obj;
}

exports = {
  assignAs,
};
