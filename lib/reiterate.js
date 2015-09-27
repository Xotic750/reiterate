/**
 * @file {@link http://xotic750.github.io/reiterate/ reiterate}
 * A modern iteration library.
 * @version 0.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <http://www.gnu.org/licenses/gpl-3.0.html> GPL-3.0+}
 * @module reiterate
 */

/*jslint maxlen:80, es6:true, this:true */

/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:false, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:35,
    maxcomplexity:7
*/

/*global
    define, module
*/

/*property
    ArrayGenerator, CounterGenerator, ENTRIES, EnumerateGenerator, KEYS,
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, OPTS, StringGenerator, VALUES, abs,
    amd, asMap, asObject, asSet, asString, assign, bind, call, charCodeAt,
    chunkGenerator, compactGenerator, configurable, defineProperty,
    differenceGenerator, dropGenerator, dropWhileGenerator, entries,
    enumerable, every, exports, filterGenerator, first, flattenGenerator,
    floor, forEach, from, has, hasOwnAsSet, hasOwnProperty, initialGenerator,
    intersectionGenerator, isArray, isFinite, isNaN, join, keys, last, length,
    mapGenerator, max, min, prototype, reduce, repeatGenerator, restGenerator,
    reverse, reversed, sign, some, takeGenerator, takeWhileGenerator,
    tapGenerator, then, to, toString, unionGenerator, uniqueGenerator, value,
    valueOf, values, writable
*/

/**
 * UMD (Universal Module Definition)
 *
 * @private
 * @see https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    /*
     * AMD. Register as an anonymous module.
     */
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    /*
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory();
  } else {
    /*
     * Browser globals (root is window)
     */
    if (root.hasOwnProperty('reiterate')) {
      throw new Error('Unable to define "reiterate"');
    }

    Object.defineProperty(root, 'reiterate', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: factory()
    });
  }
}(

  /*
   * The global this object.
   */
  this,

  /**
   * Factory function
   *
   * @private
   * @return {function} The function be exported
   */
  function () {
    'use strict';

    /* constants */
    var Reiterate,

      /**
       * Returns a boolean indicating whether the object has the specified
       * property. This function can be used to determine whether an object
       * has the specified property as a direct property of that object; this
       * method does not check down the object's prototype chain.
       *
       * @param {Object} subject The object to test for the property.
       * @param {string} property The property to be tested.
       * @return {boolean} True if the object has the direct specified
       *                   property, otherwise false.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/
       * Reference/Global_Objects/Object/hasOwnProperty
       */
      hasOwn = Function.call.bind(Object.prototype.hasOwnProperty),

      /**
       * Provides a string representation of the supplied object in the form
       * "[object type]", where type is the object type.
       *
       * @private
       * @param {*} subject The object for which a class string represntation
       *                    is required.
       * @return {string} A string value of the form "[object type]".
       * @see http://www.ecma-international.org/ecma-262/6.0/
       * #sec-object.prototype.tostring
       */
      toStringTag = Function.call.bind(Object.prototype.toString),

      /**
       * Executes a provided function once per array element.
       *
       * @param {function} callback
       * @throws {TypeError} If callback is not a function
       * @param {*} [thisArg]
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
       * Global_Objects/Array/forEach
       */
      forEach = Function.call.bind(Array.prototype.forEach),

      /**
       * The private namespace for common values.
       * @private
       * @namespace
       */
      $ = {

        /**
         * The private namespace for common options.
         * @private
         * @namespace
         */
        OPTS: {

          /**
           * The private namespace for entries defaults.
           * @private
           * @namespace
           */
          ENTRIES: {
            entries: true,
            values: false,
            keys: false
          },

          /**
           * The private namespace for values defaults.
           * @private
           * @namespace
           */
          VALUES: {
            entries: false,
            values: true,
            keys: false
          },

          /**
           * The private namespace for keys defaults.
           * @private
           * @namespace
           */
          KEYS: {
            entries: false,
            values: false,
            keys: true
          }
        }

      },

      /**
       * Defines a new property directly on an object, or throws an error if
       * there is an existing property on an object, and returns the object.
       * Uses a fixed descriptor definition.
       *
       * @private
       * @param {Object} object The object on which to defined the property.
       * @param {string} property The property name.
       * @param {function} value The value of the property.
       * @throws {Error} If the property already exists.
       * @return {Object}
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/
       * Reference/Global_Objects/Object/defineProperty
       */
      setValue = (function (descriptor) {
        return function (object, property, value) {
          if (hasOwn(object, property)) {
            throw new Error('property already exists on object');
          }

          descriptor.value = value;

          return Object.defineProperty(object, property, descriptor);
        };
      }({
        enumerable: false,
        writable: true,
        configurable: true,
        value: undefined
      })),

      /**
       * Returns true if the operand inputArg is null or undefined.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if undefined or null, otherwise false.
       */
      isNil = function (subject) {
        /*jshint eqnull:true */
        return subject == null;
      },

      /**
       * The function evaluates the passed value and converts it to an
       * integer.
       *
       * @private
       * @param {*} subject The object to be converted to an integer.
       * @return {number} If the target value is NaN, null or undefined, 0 is
       *                  returned. If the target value is false, 0 is
       *                  returned and if true, 1 is returned.
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger
       */
      toInteger = function (subject) {
        var number = +subject;

        if (Number.isNaN(number)) {
          number = 0;
        } else if (number && Number.isFinite(number)) {
          number = Math.sign(number) * Math.floor(Math.abs(number));
        }

        return number;
      },

      /**
       * Returns true if the operand inputArg is a Number.
       *
       * @private
       * @param {*} subject The object to be to tested.
       * @return {boolean} True if is a number, otherwise false.
       */
      isNumber = (function (tag, typeNumber, typeObject) {
        return function (subject) {
          var type = typeof subject;

          return type === typeNumber ||
            (type === typeObject && toStringTag(subject) === tag);
        };
      }(toStringTag(0), typeof 0, typeof Object.prototype)),

      /**
       * Returns true if the operand subject is undefined
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is undefined, otherwise false.
       */
      isUndefined = (function (typeUndefined) {
        return function (subject) {
          return typeof subject === typeUndefined;
        };
      }(typeof undefined)),

      /**
       * Returns true if the operand subject is a Function
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is a function, otherwise false.
       */
      isFunction = (function (typeFunction) {
        return function (subject) {
          return typeof subject === typeFunction;
        };
      }(typeof Function)),

      /**
       * Returns true if the operand inputArg is a String.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isString = (function (tag, typeString, typeObject) {
        return function (subject) {
          var type = typeof subject;

          return type === typeString ||
            (type === typeObject && toStringTag(subject) === tag);
        };
      }(toStringTag(''), typeof '', typeof Object.prototype)),

      /**
       * Checks if value is a valid array-like length.
       *
       * @private
       * @param {*} subject The value to check.
       * @return {boolean} Returns true if value is a valid length,
       *                   else false.
       */
      isLength = (function (typeNumber) {
        return function (subject) {
          return typeof subject === typeNumber &&
            subject > -1 &&
            subject % 1 === 0 &&
            subject <= Number.MAX_SAFE_INTEGER;
        };
      }(typeof 0)),

      /**
       * Checks if value is array-like. A value is considered array-like if
       * it's  not a function and has a value.length that's an integer
       * greater than or equal to 0 and less than or equal to
       * Number.MAX_SAFE_INTEGER.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} Returns true if subject is array-like,
       *                   else false.
       */
      isArrayLike = function (subject) {
        return !isNil(subject) &&
          !isFunction(subject) &&
          isLength(subject.length);
      },

      /**
       * If 'relaxed' is falsy The function tests the subject arguments and
       * returns the Boolean value true if the argument is an object whose
       * class internal property is "Array"; otherwise it returns false. if
       * 'relaxed' is true then 'isArrayLike' is used for the test.
       *
       * @private
       * @param {*} subject The argument to be tested.
       * @param {boolean} [relaxed] Use isArrayLike rather than isArray
       * @return {boolean} True if an array, or if relaxed and array-like,
       *                   otherwise false.
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-isarray
       */
      isArray = function (subject, relaxed) {
        var isA;

        if (relaxed) {
          isA = isArrayLike(subject) && !isString(subject);
        } else {
          isA = Array.isArray(subject);
        }

        return isA;
      },

      /**
       * Tests if the two character arguments combined are a valid UTF-16
       * surrogate pair.
       *
       * @private
       * @param {*} char1 The first character of a suspected surrogate pair.
       * @param {*} char2 The second character of a suspected surrogate pair.
       * @return {boolean} Returns true if the two characters create a valid
       *                   UTF-16 surrogate pair; otherwise false.
       */
      isSurrogatePair = function (char1, char2) {
        var result = false,
          code1,
          code2;

        if (isString(char1) && isString(char2)) {
          code1 = char1.charCodeAt();
          if (code1 >= 0xD800 && code1 <= 0xDBFF) {
            code2 = char2.charCodeAt();
            if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
              result = true;
            }
          }
        }

        return result;
      },

      /**
       * Tests the subject to see if it is a function and throws an error if
       * it is not.
       *
       * @private
       * @param {*} subject The argument to test for validity.
       * @throws {TypeError} If subject is not a function
       * @return {*} Returns the subject if passes.
       */
      mustBeFunction = function (subject) {
        if (!isFunction(subject)) {
          throw new TypeError('argument must be a function');
        }

        return subject;
      },

      /**
       * Tests the subject to see if it is undefined, if not then the subject
       * must be a function, otherwise throw an error.
       *
       * @private
       * @param {*} subject The argument to test for validity
       * @throws {TypeError} If subject is not undefined and is not a
       *                     function.
       * @return {*} Returns the subject if passes.
       */
      mustBeFunctionIfDefined = function (subject, name) {
        if (!isUndefined(subject) && !isFunction(subject)) {
          throw new TypeError(
            'If not undefined, ' + name + ' must be a function'
          );
        }

        return subject;
      },

      /**
       * Converts the subject into a safe number within the max and min safe
       * integer range.
       *
       * @private
       * @param {*} subject The argument to be converted.
       * @return {number} Returns a safe number in range.
       */
      clampToSafeIntegerRange = function (subject) {
        var number = +subject;

        if (Number.isNaN(number)) {
          number = 0;
        } else if (number < Number.MIN_SAFE_INTEGER) {
          number = Number.MIN_SAFE_INTEGER;
        } else if (number > Number.MAX_SAFE_INTEGER) {
          number = Number.MAX_SAFE_INTEGER;
        }

        return number;
      },

      /**
       * The abstract operation ToLength converts its argument to an integer
       * suitable for use as the length of an array-like object.
       *
       * @private
       * @param {*} subject The object to be converted to a length.
       * @return {number} If len <= +0 then +0 else if len is +INFINITY then
       *                  2^53-1 else min(len, 2^53-1).
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tolength
       */
      toLength = function (subject) {
        var length = toInteger(subject);

        if (length <= 0) {
          length = 0;
        } else if (length > Number.MAX_SAFE_INTEGER) {
          length = Number.MAX_SAFE_INTEGER;
        }

        return length;
      },

      /**
       * Checks if value is the language type of Object.
       * (e.g. arrays, functions, objects, regexes, new Number(0),
       * and new String('')).
       *
       * @private
       * @param {*} subject The value to check.
       * @return {boolean} Returns true if value is an object, else false.
       */
      /*
      isObject = (function (typeObject, typeFunction) {
        return function (subject) {
          var type;

          if (!subject) {
            type = false;
          } else {
            type = typeof subject;
            type = type === typeObject || type === typeFunction;
          }

          return type;
        };
      }(typeof Object.prototype, typeof Function)),
      */

      /**
       * Checks if an object already exists in a stack (Set), if it does then
       * throw an error because it means there is a circular reference.
       *
       * @private
       * @param {Set} stack A set of parent objects to check values against.
       * @throws {TypeError} If the a circular reference is found.
       * @return {boolean} Returns
       */
      throwIfCircular = function (stack, value) {
        if (stack.has(value)) {
          throw new TypeError('circular object');
        }

        return false;
      },

      /**
       * Set the reverse function is the option to reverse is set.
       *
       * @private
       * @param {Object} opts The options object.
       * @param {Object} generator The generator object to set the reverse
       *                           function on.
       * @return {boolean} Returns the generator object.
       */
      setReverseIfOpt = function (opts, generator) {
        if (opts.reversed) {
          generator.reverse();
        }

        return generator;
      },

      /**
       * The assign function is used to copy the values of all of the
       * enumerable own properties from a source object to a target object.
       *
       * @private
       * @param {Object} target
       * @param {...Object} source
       * @return {Object}
       */
      assign = function (target) {
        function copy(key) {
          /*jshint validthis:true */
          target[key] = this[key];
        }

        forEach(arguments, function (arg, index) {
          if (index && !isNil(arg)) {
            Object.keys(arg).forEach(copy, arg);
          }
        });

        return target;
      },

      /**
       * A function to return the entries, values or keys depending on the
       * generator options.
       *
       * @private
       * @param {object} opts The generator options object.
       * @param {object} object The object being iterated/enumerated.
       * @param {object} object The key to get the value from the object.
       */
      getYieldValue = function (opts, object, key) {
        var result;

        if (opts.keys) {
          result = key;
        } else if (opts.values) {
          result = object[key];
        } else {
          result = [key, object[key]];
        }

        return result;
      },

      addMethods = function (object) {
        if (object !== g.repeatGenerator.prototype) {
          if (object !== g.CounterGenerator.prototype) {
            setValue(object, 'first', p.first);
            setValue(object, 'last', p.last);
            setValue(object, 'enumerate', g.EnumerateGenerator);
            setValue(object, 'unique', p.uniqueGenerator);
            setValue(object, 'flatten', p.flattenGenerator);
            setValue(object, 'compact', p.compactGenerator);
            setValue(object, 'initial', p.initialGenerator);
            setValue(object, 'rest', p.restGenerator);
            setValue(object, 'drop', p.dropGenerator);
            setValue(object, 'dropWhile', p.dropWhileGenerator);
            setValue(object, 'take', p.takeGenerator);
            setValue(object, 'takeWhile', p.takeWhileGenerator);
            setValue(object, 'every', p.every);
            setValue(object, 'some', p.some);
            setValue(object, 'filter', p.filterGenerator);
          }

          setValue(object, 'valueOf', p.valueOf);
          setValue(object, 'toString', p.toString);
          setValue(object, 'asString', p.asString);
          setValue(object, 'asObject', p.asObject);
          setValue(object, 'asMap', p.asMap);
          setValue(object, 'map', p.mapGenerator);
          setValue(object, 'reduce', p.reduce);
          setValue(object, 'difference', p.differenceGenerator);
          setValue(object, 'join', p.join);
          setValue(object, 'union', p.unionGenerator);
          setValue(object, 'intersection', p.intersectionGenerator);
        } else {
          setValue(object, 'take', p.takeGenerator);
        }

        if (object === p.uniqueGenerator.prototype ||
          object === p.unionGenerator.prototype) {

          setValue(object, 'asSet', p.hasOwnAsSet);
        } else if (object === p.intersectionGenerator.prototype) {
          setValue(object, 'asSet', p.asSet);
        }

        setValue(object, 'chunk', p.chunkGenerator);
        setValue(object, 'tap', p.tapGenerator);
        setValue(object, 'then', p.then);
      },

      populatePrototypes = function () {
        addMethods(g.CounterGenerator.prototype);
        addMethods(g.ArrayGenerator.prototype);
        addMethods(g.StringGenerator.prototype);
        addMethods(g.EnumerateGenerator.prototype);
        addMethods(g.repeatGenerator.prototype);
        addMethods(p.mapGenerator.prototype);
        addMethods(p.filterGenerator.prototype);
        addMethods(p.uniqueGenerator.prototype);
        addMethods(p.flattenGenerator.prototype);
        addMethods(p.dropGenerator.prototype);
        addMethods(p.dropWhileGenerator.prototype);
        addMethods(p.takeGenerator.prototype);
        addMethods(p.takeWhileGenerator.prototype);
        addMethods(p.tapGenerator.prototype);
        addMethods(p.chunkGenerator.prototype);
        addMethods(p.compactGenerator.prototype);
        addMethods(p.differenceGenerator.prototype);
        addMethods(p.initialGenerator.prototype);
        addMethods(p.restGenerator.prototype);
        addMethods(p.unionGenerator.prototype);
        addMethods(p.intersectionGenerator.prototype);
      },

      setIndexesOpts = function (start, end, opts) {
        opts.from = toInteger(start);
        if (opts.from < 0) {
          opts.from = Math.max(opts.length + opts.from, 0);
        } else {
          opts.from = Math.min(opts.from, opts.length);
        }

        if (isUndefined(end)) {
          opts.to = opts.length;
        } else {
          opts.to = toInteger(end);
        }

        if (opts.to < 0) {
          opts.to = Math.max(opts.length + opts.to, 0);
        } else {
          opts.to = Math.min(opts.to, opts.length);
        }

        opts.to = toLength(opts.to) - 1;
      },

      /**
       * The private namespace for common prototype functions.
       * @private
       * @namespace
       */
      p = {

        reduce: function (callback, initialValue) {
          var index,
            supplied,
            assigned,
            element;

          mustBeFunction(callback);
          if (arguments.length > 1) {
            supplied = true;
          }

          index = 0;
          for (element of this) {
            if (!supplied && !assigned) {
              initialValue = element;
              assigned = true;
            } else {
              initialValue = callback(initialValue, element, index);
            }

            index += 1;
          }


          return initialValue;
        },

        tapGenerator: function* (callback, thisArg) {
          var index,
            element;

          mustBeFunction(callback);
          index = 0;
          for (element of this) {
            callback.call(thisArg, element, index);
            yield element;
            index += 1;
          }
        },

        every: function (callback, thisArg) {
          var index,
            result,
            element;

          mustBeFunction(callback);
          index = 0;
          result = true;
          for (element of this) {
            if (!callback.call(thisArg, element, index)) {
              result = false;
              break;
            }

            index += 1;
          }

          return result;
        },

        some: function (callback, thisArg) {
          var index,
            result,
            element;

          mustBeFunction(callback);
          index = 0;
          result = false;
          for (element of this) {
            if (callback.call(thisArg, element, index)) {
              result = true;
              break;
            }

            index += 1;
          }

          return result;
        },

        valueOf: function () {
          var result = [],
            item;

          for (item of this) {
            result.push(item);
          }

          return result;
        },

        join: function (seperator) {
          var iterator = this[Symbol.iterator](),
            item = iterator.next(),
            result = '',
            next;

          if (isUndefined(seperator)) {
            seperator = ',';
          }

          while (!item.done) {
            result += item.value;
            next = iterator.next();
            if (!next.done) {
              result += seperator;
            }

            item = next;
          }

          return result;
        },

        toString: function () {
          return this.join();
        },

        asString: function () {
          return this.join('');
        },

        asObject: function () {
          var result = {},
            index = 0,
            item;

          for (item of this) {
            result[index] = item;
            index += 1;
          }

          return setValue(result, 'length', index);
        },

        asMap: function () {
          var result = new Map(),
            index = 0,
            item;

          for (item of this) {
            result.set(index, item);
            index += 1;
          }

          return result;
        },

        asSet: function () {
          var result = new Set(),
            item;

          for (item of this) {
            result.add(item);
          }

          return result;
        },

        dropGenerator: function* (number) {
          var index = 0,
            length = toLength(number),
            item;

          for (item of this) {
            if (index >= length) {
              yield item;
            }

            index += 1;
          }
        },

        restGenerator: function* () {
          yield * this.drop(1);
        },

        dropWhileGenerator: function* (callback, thisArg) {
          var index,
            item,
            drop;

          mustBeFunction(callback);
          drop = true;
          index = 0;
          for (item of this) {
            if (drop) {
              drop = callback.call(thisArg, item, index);
            }

            if (!drop) {
              yield item;
            }

            index += 1;
          }
        },

        takeGenerator: function* (number) {
          var length = toLength(number),
            index,
            item;

          if (length) {
            index = 0;
            for (item of this) {
              if (index < length) {
                yield item;
              } else {
                break;
              }

              index += 1;
            }
          }
        },

        takeWhileGenerator: function* (callback, thisArg) {
          var index,
            item,
            take;

          mustBeFunction(callback);
          take = true;
          index = 0;
          for (item of this) {
            if (take) {
              take = callback.call(thisArg, item, index);
            }

            if (take) {
              yield item;
            } else {
              break;
            }

            index += 1;
          }
        },

        chunkGenerator: function* (size) {
          var length = toLength(size) || 1,
            chunk = [],
            item;

          for (item of this) {
            if (chunk.length < length) {
              chunk.push(item);
            } else {
              yield chunk;
              chunk = [item];
            }
          }

          if (chunk.length) {
            yield chunk;
          }
        },

        compactGenerator: function* () {
          for (var item of this) {
            if (item) {
              yield item;
            }
          }
        },

        differenceGenerator: function* (values) {
          var vals = new Set(new Reiterate(values).values()),
            item;

          for (item of this) {
            if (!vals.has(item)) {
              yield item;
            }
          }
        },

        initialGenerator: function* () {
          var iterator = this[Symbol.iterator](),
            item = iterator.next(),
            next;

          while (!item.done) {
            next = iterator.next();
            if (!next.done) {
              yield item.value;
            }

            item = next;
          }
        },

        first: function () {
          var item = this[Symbol.iterator]().next();

          if (!item.done) {
            return item.value;
          }
        },

        last: function () {
          var iterator = this[Symbol.iterator](),
            item = iterator.next(),
            next;

          while (!item.done) {
            next = iterator.next();
            if (next.done) {
              return item.value;
            }

            item = next;
          }
        },

        uniqueGenerator: function* () {
          var seen = new Set(),
            item;

          for (item of this) {
            if (!seen.has(item)) {
              yield item;
              seen.add(item);
            }
          }

          return seen;
        },

        intersectionGenerator: (function () {
          function has(seen) {
            /*jshint validthis:true */
            return seen.has(this);
          }

          function push(arg) {
            /*jshint validthis:true */
            this.push(new Set(new Reiterate(arg)));
          }

          return function* () {
            var seens,
              done,
              seen,
              item;

            for (item of this) {
              if (!seen || !seen.has(item)) {
                if (!done) {
                  seens = [];
                  forEach(arguments, push, seens);
                  seen = new Set();
                  done = true;
                }

                if (!done || seens.every(has, item)) {
                  yield item;
                }

                seen.add(item);
              }
            }
          };
        }()),

        unionGenerator: function* () {
          var seen = new Set(),
            item,
            arg;

          for (item of this) {
            if (!seen.has(item)) {
              yield item;
              seen.add(item);
            }
          }

          for (arg of new g.ArrayGenerator(arguments)) {
            for (item of new Reiterate(arg)) {
              if (!seen.has(item)) {
                yield item;
                seen.add(item);
              }
            }
          }

          return seen;
        },

        hasOwnAsSet: function () {
          var iterator = this[Symbol.iterator](),
            next = iterator.next();

          if (!next.done) {
            do {
              next = iterator.next();
            } while (!next.done);
          }

          return next.value;
        },

        flattenGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              index: 0,
              prev: previous
            });
          }

          function* iterateStack(stack, object, relaxed) {
            var tail,
              value;

            while (stack && stack.size) {
              tail = stack.get(object);
              if (tail.index >= object.length) {
                stack.delete(object);
                object = tail.prev;
              } else {
                value = object[tail.index];
                if (isArray(value, relaxed)) {
                  throwIfCircular(stack, value);
                  setStack(stack, value, object);
                  object = value;
                } else {
                  yield value;
                }

                tail.index += 1;
              }
            }
          }

          return function* (relaxed) {
            var stack = new Map(),
              object;

            for (object of this) {
              if (isArray(object, relaxed)) {
                setStack(stack, object, null);
              } else {
                yield object;
              }

              yield * iterateStack(stack, object, relaxed);
            }
          };
        }()),

        /*
         * Future code
         *
        walkOwnGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              keys: Object.keys(current),
              index: 0,
              prev: previous
            });
          }

          return function* () {
            var stack = new Map(),
              object,
              value,
              tail,
              key;

            for (object of this) {
              if (isObject(object)) {
                setStack(stack, object, null);
              } else {
                yield object;
              }

              while (stack && stack.size) {
                tail = stack.get(object);
                if (tail.index >= tail.keys.length) {
                  stack.delete(object);
                  object = tail.prev;
                } else {
                  key = tail.keys[tail.index];
                  value = object[key];
                  if (isObject(value)) {
                    throwIfCircular(stack, value);
                    setStack(stack, value, object);
                    object = value;
                  } else {
                    yield value;
                  }

                  tail.index += 1;
                }
              }
            }
          };
        }()),
        */

        mapGenerator: function* (callback, thisArg) {
          var element,
            index;

          mustBeFunction(callback);
          index = 0;
          for (element of this) {
            yield callback.call(thisArg, element, index);
            index += 1;
          }
        },

        filterGenerator: function* (callback, thisArg) {
          var element,
            index;

          mustBeFunction(callback);
          index = 0;
          for (element of this) {
            if (callback.call(thisArg, element, index)) {
              yield element;
              index += 1;
            }
          }
        },

        then: function (generator) {
          var iterator;

          if (!isFunction(generator)) {
            mustBeFunctionIfDefined(generator, 'generator');
            iterator = this;
          } else {
            iterator = generator(this);
            addMethods(iterator);
          }

          return iterator;
        }

      },

      /**
       * The private namespace for generator functions.
       * @private
       * @namespace
       */
      g = {

        CounterGenerator: (function () {
          function* countReverseGenerator(opts) {
            var count = opts.to;

            if (opts.to <= opts.from) {
              while (count <= opts.from) {
                yield count;
                count += opts.by;
              }
            } else {
              while (count >= opts.from) {
                yield count;
                count -= opts.by;
              }
            }
          }

          function* countForwardGenerator(opts) {
            var count = opts.from;

            if (opts.from <= opts.to) {
              while (count <= opts.to) {
                yield count;
                count += opts.by;
              }
            } else {
              while (count >= opts.to) {
                yield count;
                count -= opts.by;
              }
            }
          }

          function* countGenerator(opts) {
            if (opts.reversed) {
              yield * countReverseGenerator(opts);
            } else {
              yield * countForwardGenerator(opts);
            }
          }

          function CounterGenerator() {
            if (!(this instanceof CounterGenerator)) {
              return new CounterGenerator();
            }

            var opts = {
              reversed: false,
              from: 0,
              to: Number.MAX_SAFE_INTEGER,
              by: 1
            };

            setValue(this, 'state', function () {
              return assign({}, opts);
            });

            setValue(this, Symbol.iterator, function () {
              return countGenerator(assign({}, opts));
            });

            setValue(this, 'from', function (number) {
              opts.from = clampToSafeIntegerRange(number);
              return this;
            });

            setValue(this, 'to', function (number) {
              opts.to = clampToSafeIntegerRange(number);
              return this;
            });

            setValue(this, 'by', function (number) {
              opts.by = Math.abs(clampToSafeIntegerRange(number));
              if (!opts.by) {
                throw new TypeError('can not count by zero');
              }

              return this;
            });

            setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });
          }

          return CounterGenerator;
        }()),

        ArrayGenerator: (function () {
          function* arrayGenerator(subject, opts) {
            var generator,
              key;

            if (opts.length) {
              generator = g.CounterGenerator();
              generator.from(opts.from).to(opts.to).by(opts.by);
              setReverseIfOpt(opts, generator);
              for (key of generator) {
                yield getYieldValue(opts, subject, key);
              }
            }
          }

          function ArrayGenerator(subject) {
            if (!(this instanceof ArrayGenerator)) {
              return new ArrayGenerator(subject);
            }

            var length = isArrayLike(subject) ? subject.length : 0,
              opts = assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.VALUES);

            setValue(this, 'state', function () {
              return assign({}, opts);
            });

            setValue(this, Symbol.iterator, function () {
              return arrayGenerator(subject, assign({}, opts));
            });

            setValue(this, 'entries', function () {
              assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            setValue(this, 'values', function () {
              assign(opts, $.OPTS.VALUES);
              return this;
            });

            setValue(this, 'keys', function () {
              assign(opts, $.OPTS.KEYS);
              return this;
            });

            setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            setValue(this, 'slice', function (start, end) {
              setIndexesOpts(start, end, opts);
              return this;
            });
          }

          return ArrayGenerator;
        }()),

        StringGenerator: (function () {
          function getStringYieldValue(opts, character, key) {
            var result;

            if (opts.keys) {
              result = key;
            } else if (opts.values) {
              result = String.fromCodePoint(character.codePointAt());
            } else {
              result = [key, String.fromCodePoint(character.codePointAt())];
            }

            return result;
          }

          function* stringGenerator(subject, opts) {
            var generator,
              next,
              char1,
              char2,
              key;

            if (!opts.length) {
              return;
            }

            next = true;
            generator = g.CounterGenerator(opts);
            generator.from(opts.from).to(opts.to).by(opts.by);
            setReverseIfOpt(opts, generator);
            for (key of generator) {
              if (next) {
                if (opts.reversed) {
                  char1 = subject[key - 1];
                  char2 = subject[key];
                  next = !isSurrogatePair(char1, char2);
                  if (next) {
                    yield getStringYieldValue(opts, char2, key);
                  }
                } else {
                  char1 = subject[key];
                  char2 = subject[key + 1];
                  next = !isSurrogatePair(char1, char2);
                  yield getStringYieldValue(opts, char1 + char2, key);
                }
              } else {
                next = !next;
                if (opts.reversed) {
                  yield getStringYieldValue(opts, char1 + char2, key);
                }
              }
            }
          }

          function StringGenerator(subject) {
            if (!(this instanceof StringGenerator)) {
              return new StringGenerator(subject);
            }

            var length = isArrayLike(subject) ? subject.length : 0,
              opts = assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.VALUES);

            setValue(this, 'state', function () {
              return assign({}, opts);
            });

            setValue(this, Symbol.iterator, function () {
              return stringGenerator(subject, assign({}, opts));
            });

            setValue(this, 'entries', function () {
              assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            setValue(this, 'values', function () {
              assign(opts, $.OPTS.VALUES);
              return this;
            });

            setValue(this, 'keys', function () {
              assign(opts, $.OPTS.KEYS);
              return this;
            });

            setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            setValue(this, 'slice', function (start, end) {
              var char1,
                char2;

              setIndexesOpts(start, end, opts);
              if (opts.from) {
                char1 = subject[opts.from - 1];
                char2 = subject[opts.from];
                if (isSurrogatePair(char1, char2)) {
                  opts.from += 1;
                }
              }

              if (opts.to) {
                char1 = subject[opts.to - 1];
                char2 = subject[opts.to];
                if (isSurrogatePair(char1, char2)) {
                  opts.to -= 1;
                }
              }

              return this;
            });
          }

          return StringGenerator;
        }()),

        EnumerateGenerator: (function () {
          function* enumerateGenerator(subject, opts) {
            for (var key in subject) {
              if (!opts.own || hasOwn(subject, key)) {
                yield getYieldValue(opts, subject, key);
              }
            }
          }

          function EnumerateGenerator(subject) {
            if (!(this instanceof EnumerateGenerator)) {
              return new EnumerateGenerator(subject);
            }

            var opts = assign({
              own: false
            }, $.OPTS.VALUES);

            setValue(this, 'state', function () {
              return assign({}, opts);
            });

            setValue(this, Symbol.iterator, function () {
              return enumerateGenerator(subject, assign({}, opts));
            });

            setValue(this, 'entries', function () {
              assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            setValue(this, 'values', function () {
              assign(opts, $.OPTS.VALUES);
              return this;
            });

            setValue(this, 'keys', function () {
              assign(opts, $.OPTS.KEYS);
              return this;
            });

            setValue(this, 'own', function () {
              opts.own = !opts.own;
              return this;
            });
          }

          return EnumerateGenerator;
        }()),

        repeatGenerator: function* (subject) {
          do {
            yield subject;
          } while (true);
        }

      };

    populatePrototypes();

    return (function () {
      function makeCounterGenerator(subject, to, by) {
        var generator = g.CounterGenerator();

        if (isNumber(subject)) {
          if (isNil(to)) {
            generator.to(subject);
          } else {
            generator.from(subject).to(to);
          }

          if (!isNil(by)) {
            generator.by(by);
          }
        }

        return generator;
      }

      Reiterate = function (subject, to, by) {
        if (!(this instanceof Reiterate)) {
          return new Reiterate(subject, to, by);
        }

        var generator;

        if (isNil(subject) || isNumber(subject)) {
          generator = makeCounterGenerator(subject, to, by);
        } else if (isArray(subject, to)) {
          generator = g.ArrayGenerator(subject);
        } else if (isString(subject)) {
          generator = g.StringGenerator(subject);
        } else if (isFunction(subject[Symbol.iterator])) {
          generator = subject[Symbol.iterator]();
          addMethods(generator);
        } else {
          generator = g.EnumerateGenerator(subject);
        }

        return generator;
      };

      /*
       * Static methods
       */
      setValue(Reiterate, 'array', g.ArrayGenerator);
      setValue(Reiterate, 'string', g.StringGenerator);
      setValue(Reiterate, 'enumerate', g.EnumerateGenerator);
      setValue(Reiterate, 'repeat', g.repeatGenerator);

      return Reiterate;
    }());
  }

));
