(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @file {@link http://xotic750.github.io/reiterate/ reiterate}
 * A modern iteration library.
 * @version 0.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <http://www.gnu.org/licenses/gpl-3.0.html> GPL-3.0+}
 * @module reiterate
 */

/*jslint maxlen:80, es6:true, this:true, bitwise:true, for:true */

/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    es3:true, esnext:true, plusplus:true, maxparams:3, maxdepth:6,
    maxstatements:34, maxcomplexity:23
*/

/*global
    define, module
*/

/*property
    ArrayGenerator, CounterGenerator, DONE, ENTRIES, EnumerateGenerator, KEYS,
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, OPTS, RepeatGenerator, StringGenerator,
    ThenGenerator, UnzipGenerator, VALUES, abs, add, amd, apply, asArray,
    asMap, asObject, asSet, asSetOwn, asString, assign, by, call, charCodeAt,
    chunkGenerator, codePointAt, compactGenerator, configurable,
    defineProperty, differenceGenerator, done, drop, dropGenerator,
    dropWhileGenerator, entries, enumerable, every, exports, filterGenerator,
    first, flattenGenerator, floor, forEach, from, fromCharCode, fromCodePoint,
    get, has, hasOwnProperty, index, indexOf, initialGenerator,
    intersectionGenerator, isArray, isFinite, isNaN, iterator, join, keys,
    last, length, mapGenerator, max, min, next, own, pow, prev, prototype,
    push, reduce, rest, restGenerator, reverse, reversed, set, sign, size,
    some, splice, takeGenerator, takeWhileGenerator, tapGenerator, then, to,
    toString, unionGenerator, uniqueGenerator, value, values, writable,
    zipGenerator
*/

/**
 * UMD (Universal Module Definition)
 *
 * @private
 * @see https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function (root, factory) {
  'use strict';

  var typeFunction = typeof factory,

    typeObject = typeof Object.prototype,

    /**
     * Checks if value is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, new Number(0),
     * and new String('')).
     *
     * @private
     * @param {*} subject The value to check.
     * @return {boolean} Returns true if value is an object, else false.
     */
    isObject = function (subject) {
      var type;

      if (!subject) {
        type = false;
      } else {
        type = typeof subject;
        type = type === typeObject || type === typeFunction;
      }

      return type;
    },

    defineProperty = (function (odp) {
      var fn,
        obj;

      if (odp) {
        obj = {};
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          fn = odp(obj, obj, obj) && odp;
        } catch (ignore) {}
      }

      if (!fn) {
        fn = function (object, property, descriptor) {
          if (!isObject(object)) {
            throw new TypeError('called on non-object');
          }

          object[property] = descriptor.value;

          return object;
        };
      }

      return fn;
    }(Object.defineProperty));

  if (typeof define === typeFunction && define.amd) {
    /*
     * AMD. Register as an anonymous module.
     */
    define([], function () {
      return factory(isObject, defineProperty);
    });

  } else if (typeof module === typeObject && module.exports) {
    /*
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory(isObject, defineProperty);
  } else {
    /*
     * Browser globals (root is window)
     */
    if (Object.prototype.hasOwnProperty.call(root, 'reiterate')) {
      throw new Error('Unable to define "reiterate"');
    }

    defineProperty(root, 'reiterate', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: factory(isObject, defineProperty)
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
   * @param {function} isObject
   * @param {function} defineProperty
   * @return {function} The function be exported
   */
  function (isObject, defineProperty) {
    'use strict';

    /* constants */
    var reiterate,

      strDelete = 'delete',

      strFor = 'for',

      MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1,

      MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -MAX_SAFE_INTEGER,

      /**
       * The private namespace for common values.
       * @private
       * @namespace
       */
      $ = {

        DONE: {
          done: true,
          value: undefined
        },

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

      symIt = (function (typeFunction) {
        return typeof Symbol === typeFunction ? Symbol.iterator : '@@iterator';
      }(typeof isObject)),

      /**
       * Returns true if the operand subject is null or undefined.
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
       * The abstract operation throws an error if its argument is a value that
       * cannot be converted to an Object, otherwise returns the argument.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @throws {TypeError} If subject is null or undefined.
       * @return {*} The subject if coercible.
       */
      requireObjectCoercible = function (subject) {
        if (isNil(subject)) {
          throw new TypeError('Cannot convert argument to object');
        }

        return subject;
      },

      /**
       * The abstract operation converts its argument to a value of type Object.
       *
       * @private
       * @param {*} subject The argument to be converted to an object.
       * @throws {TypeError} If subject is not coercible to an object.
       * @return {Object} Value of subject as type Object.
       * @see http://www.ecma-international.org/ecma-262/5.1/#sec-9.9
       */
      toObject = (function (asArray) {
        return function (subject) {
          var object;

          if (isObject(requireObjectCoercible(subject))) {
            object = subject;
          } else {
            object = asArray.call(subject);
          }

          return object;
        };
      }(Object.prototype.asArray)),

      /**
       * Returns a boolean indicating whether the object has the specified
       * property. This function can be used to determine whether an object
       * has the specified property as a direct property of that object; this
       * method does not check down the object's prototype chain.
       *
       * @private
       * @param {Object} subject The object to test for the property.
       * @param {string} property The property to be tested.
       * @return {boolean} True if the object has the direct specified
       *                   property, otherwise false.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/
       * Reference/Global_Objects/Object/hasOwnProperty
       */
      hasOwn = (function (hop) {
        return function (subject, property) {
          return hop.call(toObject(subject), property);
        };
      }(Object.prototype.hasOwnProperty)),

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
      toStringTag = (function (ts) {
        return function (subject) {
          return ts.call(subject);
        };
      }(Object.prototype.toString)),

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
            throw new Error(
              'property "' + property + '" already exists on object'
            );
          }

          descriptor.value = value;

          return defineProperty(object, property, descriptor);
        };
      }({
        enumerable: false,
        writable: true,
        configurable: true,
        value: undefined
      })),

      /**
       * Returns true if the operand subject is a Function
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is a function, otherwise false.
       */
      isFunction = (function (tagFunction, typeFunction) {
        return function (subject) {
          var tag = toStringTag(subject),
            result = false;

          if (isObject(subject)) {
            tag = toStringTag(subject);
            if (tag === tagFunction) {
              result = true;
            } else if (tag === '[object GeneratorFunction]') {
              result = typeof subject === typeFunction;
            }
          }

          return result;
        };
      }(toStringTag(isNil), typeof isNil)),

      /**
       * Checks if value is object-like. A value is object-like if it's not null
       * and has a typeof result of "object".
       *
       * @privaye
       * @param {*} subject The value to check.
       * @return {boolean} Returns true if value is object-like, else false.
       */
      isObjectLike = (function (typeObject) {
        return function (subject) {
          return !!subject && typeof subject === typeObject;
        };
      }(typeof Object.prototype)),

      isDate = (function (tag) {
        return function (value) {
          return isObjectLike(value) && toStringTag(value) === tag;
        };
      }(toStringTag(new Date()))),

      toPrimitive = (function (typeStr, typeNum) {
        var stringOrder = ['toString', 'valueOf'],
          numberOrder = stringOrder.reverse();

        return function (subject, hint) {
          var methodNames,
            method,
            index,
            result;

          if (!isObject(subject)) {
            result = subject;
          } else {
            /*jshint singleGroups:false */
            if (hint === typeStr || (hint !== typeNum && isDate(subject))) {
              methodNames = stringOrder;
            } else {
              methodNames = numberOrder;
            }

            index = 0;
            while (index < 2) {
              method = methodNames[index];
              if (isFunction(subject[method])) {
                result = subject[method]();
                if (!isObject(result)) {
                  break;
                }
              }

              index += 1;
            }

            throw new TypeError('ordinaryToPrimitive returned an object');
          }

          return result;
        };
      }(typeof strDelete, typeof MAX_SAFE_INTEGER)),

      toNumber = (function (typeFunction) {
        var typeUndefined = typeof undefined,
          typeBoolean = typeof false,
          typeNumber = typeof MAX_SAFE_INTEGER,
          typeString = typeof strDelete,
          typeSymbol,
          fn;

        if (typeof Symbol === typeFunction && Symbol[strFor]) {
          typeSymbol = typeof Symbol[strFor](strFor);
        }

        fn = function (subject) {
          var type,
            val;

          if (subject === null) {
            val = +0;
          } else {
            type = typeof subject;
            if (type === typeUndefined) {
              val = NaN;
            } else if (type === typeBoolean) {
              val = subject ? 1 : +0;
            } else if (type === typeNumber) {
              val = subject;
            } else if (type === typeString) {
              val = Number(subject);
            } else {
              if (typeSymbol && type === typeSymbol) {
                throw new TypeError('Can not convert symbol to a number');
              }

              val = fn(toPrimitive(subject, typeNumber));
            }
          }

          return val;
        };

        return fn;
      }(typeof isObject)),

      sign = (function (ms) {
        var fn;

        if (ms) {
          fn = ms;
        } else {
          fn = function (value) {
            return toNumber(value) && (toNumber(value >= 0) || -1);
          };
        }

        return fn;
      }(Math.sign)),

      numIsNaN = (function (nin, typeNumber) {
        var fn;

        if (nin) {
          fn = nin;
        } else {
          fn = function (subject) {
            return typeof subject === typeNumber && isNaN(subject);
          };
        }

        return fn;
      }(Number.isNaN, typeof MAX_SAFE_INTEGER)),

      numIsFinite = (function (nif, typeNumber) {
        var fn;

        if (nif) {
          fn = nif;
        } else {
          fn = function (subject) {
            return typeof subject === typeNumber && isFinite(subject);
          };
        }

        return fn;
      }(Number.isFinite, typeof MAX_SAFE_INTEGER)),

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
        var number = toNumber(subject);

        if (numIsNaN(number)) {
          number = 0;
        } else if (number && numIsFinite(number)) {
          number = sign(number) * Math.floor(Math.abs(number));
        }

        return number;
      },

      /**
       * Returns true if the operand subject is a Number.
       *
       * @private
       * @param {*} subject The object to be to tested.
       * @return {boolean} True if is a number, otherwise false.
       */
      isNumber = (function (tag, typeNumber, typeObject) {
        return function (subject) {
          var type = typeof subject;

          /*jshint singleGroups:false */
          return type === typeNumber ||
            (type === typeObject && toStringTag(subject) === tag);
        };
      }(
        toStringTag(MAX_SAFE_INTEGER),
        typeof MAX_SAFE_INTEGER,
        typeof Object.prototype
      )),

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
       * Returns true if the operand subject is a String.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isString = (function (tag, typeString, typeObject) {
        return function (subject) {
          var type = typeof subject;

          /*jshint singleGroups:false */
          return type === typeString ||
            (type === typeObject && toStringTag(subject) === tag);
        };
      }(toStringTag(strDelete), typeof strDelete, typeof Object.prototype)),

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
            subject <= MAX_SAFE_INTEGER;
        };
      }(typeof MAX_SAFE_INTEGER)),

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
      isArray = (function (ai, tag) {
        var fn;

        if (ai) {
          fn = ai;
        } else if (tag === '[object Array]') {
          fn = function (subject) {
            return isArrayLike(subject) && toStringTag(subject) === tag;
          };
        } else {
          fn = function (subject) {
            return isArrayLike(subject) &&
              !isString(subject) &&
              hasOwn(subject, 'length') &&
              hasOwn(subject, 'callee');
          };
        }

        return function (subject, relaxed) {
          var isA;

          if (relaxed) {
            isA = isArrayLike(subject) && !isString(subject);
          } else {
            isA = fn(subject);
          }

          return isA;
        };
      }(Array.isArray, toStringTag([]))),

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

      codePointAt = (function (spc) {
        var fn;

        if (spc) {
          fn = function (string, position) {
            return spc.call(string, position);
          };
        } else {
          fn = function (subject, position) {
            var string = String(requireObjectCoercible(subject)),
              size = string.length,
              index = toInteger(position),
              first,
              second,
              val;

            if (index >= 0 && index < size) {
              first = string.charCodeAt(index);
              if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
                second = string.charCodeAt(index + 1);
                if (second >= 0xDC00 && second <= 0xDFFF) {
                  val = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
                }
              }
            }

            return val || first;
          };
        }

        return fn;
      }(String.prototype.codePointAt)),

      /**
       * The isInteger method determines whether the passed value is an integer.
       * If the target value is an integer, return true, otherwise return false.
       * If the value is NaN or infinite, return false.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isInteger = function (subject) {
        return numIsFinite(subject) && toInteger(subject) === subject;
      },

      fromCodePoint = (function (sf, stringFromCharCode) {
        var fn;

        if (sf) {
          fn = sf;
        } else {
          fn = function () {
            var MAX_SIZE = 0x4000,
              codeUnits = [];

            return reduce(arguments, function (result, arg) {
              var codePnt = toNumber(arg),
                highSurrogate,
                lowSurrogate;

              if (!isInteger(codePnt) || codePnt < 0 || codePnt > 0x10FFFF) {
                throw new RangeError('Invalid codePnt point: ' + codePnt);
              }

              if (codePnt <= 0xFFFF) {
                codeUnits.push(codePnt);
              } else {
                codePnt -= 0x10000;
                /*jshint singleGroups:false */
                /*jshint bitwise:false */
                highSurrogate = (codePnt >> 10) + 0xD800;
                /*jshint bitwise:true */
                lowSurrogate = (codePnt % 0x400) + 0xDC00;
                /*jshint singleGroups:true */
                codeUnits.push(highSurrogate, lowSurrogate);
              }

              if (codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }

              return result;
            }, '') + stringFromCharCode.apply(null, codeUnits);
          };
        }

        return fn;
      }(String.fromCodePoint, String.fromCharCode)),

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
       * Converts the subject into a safe number within the max and min safe
       * integer range.
       *
       * @private
       * @param {*} subject The argument to be converted.
       * @return {number} Returns a safe number in range.
       */
      clampToSafeIntegerRange = function (subject) {
        var number = +subject;

        if (numIsNaN(number)) {
          number = 0;
        } else if (number < MIN_SAFE_INTEGER) {
          number = MIN_SAFE_INTEGER;
        } else if (number > MAX_SAFE_INTEGER) {
          number = MAX_SAFE_INTEGER;
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
        } else if (length > MAX_SAFE_INTEGER) {
          length = MAX_SAFE_INTEGER;
        }

        return length;
      },

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

      chop = function (array, start, end) {
        var object = toObject(array),
          length = toLength(object.length),
          relativeStart = toInteger(start),
          val = [],
          next = 0,
          relativeEnd,
          finalEnd,
          k;

        if (relativeStart < 0) {
          k = Math.max(length + relativeStart, 0);
        } else {
          k = Math.min(relativeStart, length);
        }

        if (isUndefined(end)) {
          relativeEnd = length;
        } else {
          relativeEnd = toInteger(end);
        }

        if (relativeEnd < 0) {
          finalEnd = Math.max(length + relativeEnd, 0);
        } else {
          finalEnd = Math.min(relativeEnd, length);
        }

        finalEnd = toLength(finalEnd);
        val.length = toLength(Math.max(finalEnd - k, 0));
        while (k < finalEnd) {
          if (k in object) {
            val[next] = object[k];
          }

          next += 1;
          k += 1;
        }

        return val;
      },

      /*
      map = (function (apm) {
        var fn;

        if (apm) {
          fn = function (array) {
            return apm.apply(array, chop(arguments, 1));
          };
        } else {
          fn = function (array, callback, thisArg) {
            var object = toObject(array),
              length,
              arr,
              index;

            mustBeFunction(fn);
            arr = [];
            arr.length = length = toLength(object.length);
            index = 0;
            while (index < length) {
              if (index in object) {
                arr[index] = callback.call(
                  thisArg,
                  object[index],
                  index,
                  object
                );
              }

              index += 1;
            }

            return arr;
          };
        }

        return fn;
      }(Array.prototype.map)),

      filter = (function (apf) {
        var fn;

        if (apf) {
          fn = function (array) {
            return apf.apply(array, chop(arguments, 1));
          };
        } else {
          fn = function (array, callback, thisArg) {
            var object = toObject(array),
              length,
              arr,
              index,
              it;

            mustBeFunction(callback);
            length = toLength(object.length);
            arr = [];
            index = 0;
            while (index < length) {
              if (index in object) {
                it = object[index];
                if (callback.call(thisArg, it, index, object)) {
                  arr.push(it);
                }
              }

              index += 1;
            }

            return arr;
          };
        }

        return fn;
      }(Array.prototype.filter)),
      */

      /*
      curry = (function () {
        return function (fn) {
          var args;

          mustBeFunction(fn);
          args = chop(arguments, 1);
          return function () {
            return fn.apply(this, args.concat(chop(arguments)));
          };
        };
      }()),
      */

      /**
       * Executes a provided function once per array element.
       *
       * @private
       * @param {array} arrayLike
       * @param {function} callback
       * @throws {TypeError} If callback is not a function
       * @param {*} [thisArg]
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
       * Global_Objects/Array/forEach
       */
      forEach = (function (apf) {
        var fn;

        if (apf) {
          fn = function (array) {
            return apf.apply(array, chop(arguments, 1));
          };
        } else {
          fn = function (array, callback, thisArg) {
            var object = toObject(array),
              length,
              index;

            mustBeFunction(callback);
            length = toLength(object.length);
            index = 0;
            while (index < length) {
              if (index in object) {
                callback.call(thisArg, object[index], index, object);
              }

              index += 1;
            }
          };
        }

        return fn;
      }(Array.prototype.forEach)),

      /**
       * Apply a function against an accumulator and each value of the array
       * (from left-to-right) as to reduce it to a single value.
       *
       * @private
       * @param {array} arrayLike
       * @throws {TypeError} If array is null or undefined
       * @param {Function} callback
       * @throws {TypeError} If callback is not a function
       * @param {*} [initialValue]
       * @return {*}
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/
       * Global_Objects/Array/reduce
       */
      reduce = (function (apr) {
        var msg,
          fn;

        if (apr) {
          fn = function (array) {
            return apr.apply(array, chop(arguments, 1));
          };
        } else {
          msg = 'reduce of empty array with no initial value';
          fn = function (array, callback, initialValue) {
            var object = toObject(array),
              acc,
              length,
              kPresent,
              index;

            mustBeFunction(callback);
            length = toLength(object.length);
            if (!length && arguments.length === 1) {
              throw new TypeError(msg);
            }

            index = 0;
            if (arguments.length > 1) {
              acc = initialValue;
            } else {
              kPresent = false;
              while (!kPresent && index < length) {
                kPresent = index in object;
                if (kPresent) {
                  acc = object[index];
                  index += 1;
                }
              }

              if (!kPresent) {
                throw new TypeError(msg);
              }
            }

            while (index < length) {
              if (index in object) {
                acc = callback.call(
                  undefined,
                  acc,
                  object[index],
                  index,
                  object
                );
              }

              index += 1;
            }

            return acc;
          };
        }

        return fn;
      }(Array.prototype.reduce)),

      every = (function (ape) {
        var fn;

        if (ape) {
          fn = function (array) {
            return ape.apply(array, chop(arguments, 1));
          };
        } else {
          fn = function (array, callback, thisArg) {
            var object = toObject(array),
              length,
              val,
              index;

            mustBeFunction(callback);
            length = toLength(object.length);
            val = true;
            index = 0;
            while (index < length) {
              if (index in object) {
                val = !!callback.call(thisArg, object[index], index, object);
                if (!val) {
                  break;
                }
              }

              index += 1;
            }

            return val;
          };
        }

        return fn;
      }(Array.prototype.every)),

      objectKeys = (function (ok) {
        var fn;

        if (ok) {
          fn = ok;
        } else {
          fn = function (subject) {
            var object = toObject(subject),
              ownKeys = [],
              key;

            for (key in object) {
              if (hasOwn(object, key)) {
                ownKeys.push(key);
              }
            }

            return ownKeys;
          };
        }

        return fn;
      }(Object.keys)),

      /**
       * The assign function is used to copy the values of all of the
       * enumerable own properties from a source object to a target object.
       *
       * @private
       * @param {Object} target
       * @param {...Object} source
       * @return {Object}
       */
      assign = (function (oa) {
        var fn;

        if (oa) {
          fn = oa;
        } else {
          fn = function (target) {
            var object = toObject(target);

            function copy(key) {
              /*jshint validthis:true */
              object[key] = this[key];
            }

            forEach(chop(arguments, 1), function (arg) {
              if (!isNil(arg)) {
                forEach(objectKeys(arg), copy, arg);
              }
            });

            return object;
          };
        }

        return fn;
      }(Object.assign)),

      indexOf = (function (api) {
        var fn = api;

        if (api) {
          fn = function (array) {
            return api.apply(array, chop(arguments, 1));
          };
        } else {
          fn = function (array, searchElement, fromIndex) {
            var object = toObject(array),
              length = toLength(object.length),
              val = -1,
              index;

            if (length) {
              if (arguments.length > 1) {
                fromIndex = toInteger(fromIndex);
              } else {
                fromIndex = 0;
              }

              if (fromIndex < length) {
                if (fromIndex < 0) {
                  fromIndex = length - Math.abs(fromIndex);
                  if (fromIndex < 0) {
                    fromIndex = 0;
                  }
                }

                index = fromIndex;
                while (index < length) {
                  if (index in object && searchElement === object[index]) {
                    val = index;
                    break;
                  }

                  index += 1;
                }
              }
            }

            return val;
          };
        }

        return fn;
      }(Array.prototype.indexOf)),

      is = function (x, y) {
        /*jshint singleGroups:false */
        return (x === y && (x !== 0 || 1 / x === 1 / y)) ||
          (numIsNaN(x) && numIsNaN(y));
      },

      getIndex = function (array, item) {
        var index;

        if (item === 0 || numIsNaN(item)) {
          index = array.length - 1;
          while (index >= 0 && !is(item, array[index])) {
            index -= 1;
          }
        } else {
          index = indexOf(array, item);
        }

        return index;
      },

      includes = function (array, item) {
        return -1 < getIndex(array, item);
      },

      SetObject = (function (typeFunction) {
        var s = typeof Set === typeFunction && Set,
          fn;

        if (s) {
          fn = s;
        } else {
          fn = function (iterable) {
            var iterator,
              next;

            setValue(this, 'keys', []);
            if (!isNil(iterable)) {
              if (isArrayLike(iterable)) {
                iterator = reiterate(iterable, true);
              } else if (iterable[symIt]) {
                iterator = iterable[symIt]();
              }
            }

            if (iterator) {
              next = iterator.next();
              while (!next.done) {
                if (!includes(this.keys, next.value)) {
                  this.keys.push(next.value);
                }

                next = iterator.next();
              }
            }

            setValue(this, 'size', this.keys.length);
          };

          setValue(fn.prototype, 'has', function (key) {
            return includes(this.keys, key);
          });

          setValue(fn.prototype, 'add', function (key) {
            if (!includes(this.keys, key)) {
              this.keys.push(key);
              this.size = this.keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'clear', function () {
            this.keys.length = this.size = 0;
            return this;
          });

          setValue(fn.prototype, strDelete, function (key) {
            var index = getIndex(this.keys, key);

            if (-1 < index) {
              this.keys.splice(index, 1);
              this.size = this.keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            forEach(this.keys, callback, thisArg);

            return this;
          });

          setValue(fn.prototype, 'values', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: this.keys[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, 'keys', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: index
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, 'entries', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: [index, this.keys[index]]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, symIt, function () {
            return this.values();
          });
        }

        return fn;
      }(typeof isObject)),

      MapObject = (function (typeFunction) {
        var m = typeof Map === typeFunction && Map,
          fn;

        if (m) {
          fn = m;
        } else {
          fn = function (iterable) {
            var iterator,
              index,
              next;

            this.keys = [];
            this.values = [];
            if (!isNil(iterable)) {
              if (isArrayLike(iterable)) {
                iterator = reiterate(iterable, true).entries();
              } else if (iterable[symIt]) {
                iterator = iterable[symIt]();
              }
            }

            if (iterator) {
              next = iterator.next();
              while (!next.done) {
                index = getIndex(this.keys, next.value[0]);
                if (-1 < index) {
                  this.keys.push(next.value[0]);
                  this.values.push(next.value[1]);
                } else {
                  this.values[index] = next.value[1];
                }

                next = iterator.next();
              }
            }

            setValue(this, 'size', this.keys.length);
          };

          setValue(fn.prototype, 'has', function (key) {
            return includes(this.keys, key);
          });

          setValue(fn.prototype, 'set', function (key, value) {
            var index = getIndex(this.keys, key);

            if (-1 < index) {
              this.values[index] = value;
            } else {
              this.keys.push(key);
              this.values.push(value);
              this.size = this.keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'clear', function () {
            this.keys.length = this.values = this.size = 0;
            return this;
          });

          setValue(fn.prototype, 'get', function (key) {
            var index = getIndex(this.keys, key);

            return -1 < index ? this.values[index] : undefined;
          });

          setValue(fn.prototype, strDelete, function (key) {
            var index = getIndex(this.keys, key);

            if (-1 < index) {
              this.keys.splice(index, 1);
              this.values.splice(index, 1);
              this.size = this.keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            mustBeFunction(callback);
            forEach(this.keys, function (key, index) {
              callback.call(thisArg, this.values[index], key, this);
            }, this);

            return this;
          });

          setValue(fn.prototype, 'values', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: this.values[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, 'keys', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: this.keys[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, 'entries', function () {
            var length = this.keys.length,
              index = 0,
              object;

            return {
              next: function () {
                if (index < length) {
                  object = {
                    done: false,
                    value: [this.keys[index], this.values[index]]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          });

          setValue(fn.prototype, symIt, function () {
            return this.entries();
          });
        }

        return fn;
      }(typeof isObject)),

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
        setValue(object, 'asArray', p.asArray);
        //setValue(object, 'asString', p.asString);
        setValue(object, 'asString', p.asString);
        setValue(object, 'asObject', p.asObject);
        setValue(object, 'asMap', p.asMap);
        setValue(object, 'map', p.mapGenerator);
        setValue(object, 'reduce', p.reduce);
        setValue(object, 'difference', p.differenceGenerator);
        setValue(object, 'join', p.join);
        setValue(object, 'union', p.unionGenerator);
        setValue(object, 'intersection', p.intersectionGenerator);
        setValue(object, 'asSet', p.asSet);
        setValue(object, 'chunk', p.chunkGenerator);
        setValue(object, 'tap', p.tapGenerator);
        setValue(object, 'then', p.then);
        setValue(object, 'zip', p.zipGenerator);
      },

      populatePrototypes = function () {
        addMethods(g.CounterGenerator.prototype);
        addMethods(g.ArrayGenerator.prototype);
        addMethods(g.StringGenerator.prototype);
        addMethods(g.EnumerateGenerator.prototype);
        addMethods(g.RepeatGenerator.prototype);
        addMethods(g.UnzipGenerator.prototype);
        addMethods(g.ThenGenerator.prototype);
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
          var iterator,
            supplied,
            assigned,
            index,
            next;

          mustBeFunction(callback);
          if (arguments.length > 1) {
            supplied = true;
          }

          iterator = this[symIt]();
          next = iterator.next();
          if (!next.done) {
            index = 0;
            while (!next.done) {
              if (!supplied && !assigned) {
                initialValue = next.value;
                assigned = true;
              } else {
                initialValue = callback(initialValue, next.value, index);
              }

              next = iterator.next();
              index += 1;
            }
          }

          return initialValue;
        },

        tapGenerator: function (callback, thisArg) {
          var generator;

          mustBeFunction(callback);
          generator = this[symIt];
          this[symIt] = function () {
            var index = 0,
              itertor,
              next;

            return {
              next: function () {
                var object;

                itertor = itertor || generator();
                next = itertor.next();
                if (!next.done) {
                  callback.call(thisArg, next.value, index);
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        every: function (callback, thisArg) {
          var iterator,
            result,
            index,
            next;

          mustBeFunction(callback);
          iterator = this[symIt]();
          next = iterator.next();
          result = true;
          if (!next.done) {
            index = 0;
            while (result && !next.done) {
              if (!callback.call(thisArg, next.value, index)) {
                result = false;
              } else {
                next = iterator.next();
                index += 1;
              }
            }
          }

          return result;
        },

        some: function (callback, thisArg) {
          var iterator,
            result,
            index,
            next;

          mustBeFunction(callback);
          iterator = this[symIt]();
          next = iterator.next();
          result = false;
          if (!next.done) {
            index = 0;
            while (!result && !next.done) {
              if (callback.call(thisArg, next.value, index)) {
                result = true;
              } else {
                next = iterator.next();
                index += 1;
              }
            }
          }

          return result;
        },

        asArray: function () {
          var iterator = this[symIt](),
            next = iterator.next(),
            result = [];

          while (!next.done) {
            result.push(next.value);
            next = iterator.next();
          }

          return result;
        },

        join: function (seperator) {
          var iterator = this[symIt](),
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

        /*
        asString: function () {
          return this.join();
        },
        */

        asString: function () {
          return this.join('');
        },

        asObject: function () {
          var iterator = this[symIt](),
            next = iterator.next(),
            result = {},
            index = 0;

          while (!next.done) {
            result[index] = next.value;
            next = iterator.next();
            index += 1;
          }

          return setValue(result, 'length', index);
        },

        asMap: function () {
          var iterator = this[symIt](),
            next = iterator.next(),
            result = new MapObject(),
            index;

          if (!next.done) {
            index = 0;
            while (!next.done) {
              result.set(index, next.value);
              next = iterator.next();
              index += 1;
            }
          }

          return result;
        },

        asSet: function () {
          var iterator = this[symIt](),
            next = iterator.next(),
            result = new SetObject();

          while (!next.done) {
            result.add(next.value);
            next = iterator.next();
          }

          return result;
        },

        asSetOwn: function () {
          var iterator = this[symIt](),
            next;

          do {
            next = iterator.next();
          } while (!next.done);

          return next.value;
        },

        dropGenerator: function (number) {
          var generator = this[symIt],
            howMany = toLength(number);

          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                while (!next.done && index < howMany) {
                  next = iterator.next();
                  index += 1;
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        restGenerator: function () {
          return this.drop(1);
        },

        dropWhileGenerator: function (callback, thisArg) {
          var generator;

          mustBeFunction(callback);
          generator = this[symIt];
          this[symIt] = function () {
            var index = 0,
              iterator,
              dropped,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                while (!dropped && !next.done && callback.call(
                    thisArg,
                    next.value,
                    index
                  )) {
                  next = iterator.next();
                  index += 1;
                }

                dropped = true;
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeGenerator: function (number) {
          var generator = this[symIt],
            howMany = toLength(number);

          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                if (!next.done && index < howMany) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeWhileGenerator: function (callback, thisArg) {
          var generator;

          mustBeFunction(callback);
          generator = this[symIt];
          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                if (!next.done && callback.call(thisArg, next.value, index)) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        chunkGenerator: function (size) {
          var generator = this[symIt],
            howMany = toLength(size) || 1;

          this[symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var chunk,
                  object;

                iterator = iterator || generator();
                next = next || iterator.next();
                if (!next.done) {
                  chunk = [];
                }

                while (!next.done && chunk && chunk.length < howMany) {
                  chunk.push(next.value);
                  next = iterator.next();
                }

                /*jshint singleGroups:false */
                if (!next.done || (chunk && chunk.length)) {
                  object = {
                    done: false,
                    value: chunk
                  };
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        compactGenerator: function () {
          var generator = this[symIt];

          this[symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                while (!next.done && !next.value) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        differenceGenerator: function (values) {
          var generator = this[symIt],
            set;

          this[symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                set = set || new SetObject(reiterate(values).values());
                while (!next.done && set.has(next.value)) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        initialGenerator: function () {
          var generator = this[symIt];

          this[symIt] = function () {
            var iterator,
              after,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next || iterator.next();
                after = iterator.next();
                if (!next.done && !after.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  next = after;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        first: function () {
          var next = this[symIt]().next();

          return next.done ? undefined : next.value;
        },

        last: function () {
          var iterator = this[symIt](),
            next = iterator.next(),
            after,
            last;

          while (!next.done) {
            after = iterator.next();
            if (after.done) {
              last = next.value;
              break;
            }

            next = after;
          }

          return last;
        },

        uniqueGenerator: function () {
          var generator = this[symIt];

          this[symIt] = function () {
            var seen,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                seen = seen || new SetObject();
                next = next || iterator.next();
                while (!next.done && seen.has(next.value)) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  seen.add(next.value);
                  next = iterator.next();
                } else {
                  object = assign({}, $.DONE);
                  object.value = seen;
                }

                return object;
              }
            };
          };

          return this;
        },

        intersectionGenerator: (function () {
          function has(argSet) {
            /*jshint validthis:true */
            return argSet.has(this);
          }

          function push(argSets, arg) {
            if (isArrayLike(arg) || isFunction(arg[symIt])) {
              argSets.push(new SetObject(reiterate(arg)));
            }

            return argSets;
          }

          return function () {
            var generator = this[symIt],
              args = arguments;

            this[symIt] = function () {
              var iterator,
                argSets,
                seen,
                next;

              return {
                next: function () {
                  var object;

                  argSets = argSets || reduce(args, push, []);
                  seen = seen || new SetObject();
                  iterator = iterator || generator();
                  next = iterator.next();
                  while (!next.done) {
                    if (!seen.has(next.value)) {
                      if (every(argSets, has, next.value)) {
                        seen.add(next.value);
                        //yield next.value;
                        break;
                      }

                      seen.add(next.value);
                    }

                    next = iterator.next();
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };
                  } else {
                    object = assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        unionGenerator: function () {
          var generator = this[symIt],
            args = arguments;


          this[symIt] = function () {
            var seen,
              iterator,
              next,
              outerIt,
              innerIt,
              outerNext,
              innerNext;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                seen = seen || new SetObject();
                next = iterator.next();
                while (!next.done && !outerIt) {
                  if (!seen.has(next.value)) {
                    seen.add(next.value);
                    //yield next.value
                    break;
                  }

                  next = iterator.next();
                }

                if (next.done && args.length) {
                  outerIt = outerIt || new g.ArrayGenerator(args)[symIt]();
                  if (!innerNext || innerNext.done) {
                    outerNext = outerIt.next();
                  }

                  while (!outerNext.done || !innerNext) {
                    if (isArrayLike(outerNext.value) ||
                      isFunction(outerNext.value[symIt])) {
                      /*jshint singleGroups:false */
                      if (!innerIt || (innerNext && innerNext.done)) {
                        if (isArrayLike(outerNext.value)) {
                          innerIt = reiterate(outerNext.value, true)[symIt]();
                        } else {
                          innerIt = outerNext.value[symIt]();
                        }
                      }

                      if (innerIt) {
                        innerNext = innerIt.next();
                        while (!innerNext.done) {
                          if (!seen.has(innerNext.value)) {
                            seen.add(innerNext.value);
                            //yield innerNext.value;
                            break;
                          }

                          innerNext = innerIt.next();
                        }
                      }
                    }

                    if (innerNext.done) {
                      outerNext = outerIt.next();
                    } else {
                      break;
                    }
                  }
                }

                /*jshint singleGroups:false */
                if (!next.done || (innerNext && !innerNext.done)) {
                  object = {
                    done: false,
                    value: innerNext ? innerNext.value : next.value
                  };
                } else {
                  object = assign({}, $.DONE);
                  object.value = seen;
                }

                return object;
              }
            };
          };

          return this;
        },

        zipGenerator: (function () {
          function ofNext(zip, iterator) {
            var next = iterator.next();

            if (next.done) {
              zip.value.push(undefined);
            } else {
              zip.value.push(next.value);
              zip.done = false;
            }

            return zip;
          }

          function push(iterators, arg) {
            if (isArrayLike(arg) || isFunction(arg[symIt])) {
              iterators.push(reiterate(arg, true)[symIt]());
            }

            return iterators;
          }

          return function () {
            var generator = this[symIt],
              args = arguments;

            this[symIt] = function () {
              var iterators,
                next;

              return {
                next: function () {
                  var object;

                  iterators = iterators || reduce(args, push, [generator()]);
                  while (!next || !next.done) {
                    next = reduce(iterators, ofNext, {
                      value: [],
                      done: true
                    });

                    if (!next.done) {
                      //yield zip.value;
                      break;
                    }
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };
                  } else {
                    object = assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        flattenGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              index: 0,
              prev: previous
            });
          }

          return function (relaxed) {
            var generator = this[symIt];

            this[symIt] = function () {
              var stack,
                iterator,
                next,
                item,
                done1;

              return {
                next: function () {
                  var object,
                    value,
                    tail,
                    done2;

                  iterator = iterator || generator();
                  stack = stack || new MapObject();
                  next = !next || done1 ? iterator.next() : next;
                  done1 = false;
                  while (!next.done && !done2) {
                    if (!stack.size) {
                      if (isArray(next.value, relaxed)) {
                        item = next.value;
                        setStack(stack, item, null);
                      } else {
                        //yield
                        value = next.value;
                        done1 = true;
                        break;
                      }
                    }

                    while (stack.size) {
                      tail = stack.get(item);
                      if (tail.index >= item.length) {
                        stack[strDelete](item);
                        item = tail.prev;
                      } else {
                        value = item[tail.index];
                        if (isArray(value, relaxed)) {
                          throwIfCircular(stack, value);
                          setStack(stack, value, item);
                          item = value;
                        } else {
                          //yield
                          tail.index += 1;
                          done2 = true;
                          break;
                        }

                        tail.index += 1;
                      }
                    }

                    if (!done2) {
                      next = iterator.next();
                    }
                  }

                  if (!next.done) {
                    object = {
                      done: false,
                      value: value
                    };
                  } else {
                    object = assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        /*
         * Future code
         *
        walkOwnGenerator: (function () {
          function setStack(stack, current, previous) {
            return stack.set(current, {
              keys: keys(current),
              index: 0,
              prev: previous
            });
          }

          return function* () {
            var iterator = this[symIt](),
              next = iterator.next(),
              stack,
              object,
              value,
              tail;

            if (next.done) {
              return;
            }

            stack = new es6.Map();
            while (!next.done) {
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
                  value = object[next.value];
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

              next = iterator.next();
            }
          };
        }()),
        */

        mapGenerator: function (callback, thisArg) {
          var generator;

          mustBeFunction(callback);
          generator = this[symIt];
          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: callback.call(thisArg, next.value, index)
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        filterGenerator: function (callback, thisArg) {
          var generator;

          mustBeFunction(callback);
          generator = this[symIt];
          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = iterator.next();
                while (!next.done &&
                  !callback.call(thisArg, next.value, index)) {
                  next = iterator.next();
                  index += 1;
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        then: function (gen) {
          var generator = this[symIt],
            context;

          if (!isUndefined(gen)) {
            if (!isFunction(gen)) {
              throw new TypeError(
                'If not undefined, generator must be a function'
              );
            }

            context = new g.ThenGenerator(gen, this, chop(arguments, 1));
          } else {
            this[symIt] = function () {
              var index = 0,
                iterator,
                next;

              return {
                next: function () {
                  var object;

                  iterator = iterator || generator();
                  next = iterator.next();
                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };

                    index += 1;
                  } else {
                    object = assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            context = this;
          }

          return context;
        }
      },

      /**
       * The private namespace for generator functions.
       * @private
       * @namespace
       */
      g = {

        ThenGenerator: function (generator, context, argsArray) {
          this[symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                if (!iterator) {
                  if (isFunction(generator)) {
                    iterator = generator.apply(context, argsArray);
                  } else {
                    iterator = generator[symIt]();
                  }
                }

                next = iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          /*
          this[symIt] = function () {
            var inter = Function.prototype.apply.bind(generator, argsArray);

            inter[symIt] = generator[symIt];
            return inter;
          };
          */
        },

        CounterGenerator: (function () {
          function countReverseGenerator(opts) {
            var count = opts.to;

            return {
              next: function () {
                var object;

                if (opts.to <= opts.from) {
                  if (count <= opts.from) {
                    object = {
                      done: false,
                      value: count
                    };

                    count += opts.by;
                  } else {
                    object = assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.from) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = assign({}, $.DONE);
                  }
                }

                return object;
              }
            };
          }

          function countForwardGenerator(opts) {
            var count = opts.from;

            return {
              next: function () {
                var object;

                if (opts.from <= opts.to) {
                  if (count <= opts.to) {
                    object = {
                      done: false,
                      value: count
                    };

                    count += opts.by;
                  } else {
                    object = assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.to) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = assign({}, $.DONE);
                  }
                }

                return object;
              }
            };
          }

          function countGenerator(opts) {
            var iterator;

            if (!iterator) {
              if (opts.reversed) {
                iterator = countReverseGenerator(opts);
              } else {
                iterator = countForwardGenerator(opts);
              }
            }

            return {
              next: function () {
                return iterator.next();
              }
            };
          }

          function CounterGenerator() {
            if (!(this instanceof CounterGenerator)) {
              return new CounterGenerator();
            }

            var opts = {
              reversed: false,
              from: 0,
              to: MAX_SAFE_INTEGER,
              by: 1
            };

            setValue(this, 'state', function () {
              return assign({}, opts);
            });

            setValue(this, symIt, function () {
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
          function arrayGenerator(subject, opts) {
            var generator,
              counter,
              iterator,
              next;

            if (opts.length) {
              generator = g.CounterGenerator();
              generator.from(opts.from).to(opts.to).by(opts.by);
              setReverseIfOpt(opts, generator);
              counter = generator[symIt]();
              next = counter.next();
              iterator = {
                next: function () {
                  var object;

                  if (!next.done) {
                    object = {
                      done: false,
                      value: getYieldValue(opts, subject, next.value)
                    };

                    next = counter.next();
                  } else {
                    object = assign({}, $.DONE);
                  }

                  return object;
                }
              };
            } else {
              iterator = {
                next: function () {
                  return assign({}, $.DONE);
                }
              };
            }

            return iterator;
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

            setValue(this, symIt, function () {
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
              result = fromCodePoint(codePointAt(character));
            } else {
              result = [key, fromCodePoint(codePointAt(character))];
            }

            return result;
          }

          function stringGenerator(subject, opts) {
            var generator,
              counter,
              iterator,
              isPair,
              next;

            if (!opts.length) {
              return {
                next: function () {
                  return assign({}, $.DONE);
                }
              };
            }

            generator = g.CounterGenerator(opts);
            generator.from(opts.from).to(opts.to).by(opts.by);
            setReverseIfOpt(opts, generator);
            counter = generator[symIt]();
            next = counter.next();
            iterator = {
              next: function () {
                var object,
                  char1,
                  char2;

                if (!next.done) {
                  while (!next.done && !object) {
                    if (!isPair) {
                      if (opts.reversed) {
                        char1 = subject[next.value - 1];
                        char2 = subject[next.value];
                        isPair = isSurrogatePair(char1, char2);
                        if (!isPair) {
                          object = {
                            done: false,
                            value: getStringYieldValue(
                              opts,
                              char2,
                              next.value
                            )
                          };
                        }
                      } else {
                        char1 = subject[next.value];
                        char2 = subject[next.value + 1];
                        isPair = isSurrogatePair(char1, char2);
                        object = {
                          done: false,
                          value: getStringYieldValue(
                            opts,
                            char1 + char2,
                            next.value
                          )
                        };
                      }
                    } else {
                      isPair = !isPair;
                      if (opts.reversed) {
                        object = {
                          done: false,
                          value: getStringYieldValue(
                            opts,
                            char1 + char2,
                            next.value
                          )
                        };
                      }
                    }

                    next = counter.next();
                  }
                }

                return object || assign({}, $.DONE);
              }
            };

            return iterator;
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

            setValue(this, symIt, function () {
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
          function enumerateGenerator(subject, opts) {
            var iterator,
              keys,
              next,
              key;

            if (opts.own) {
              keys = objectKeys(subject);
            } else {
              keys = [];
              for (key in subject) {
                /*jshint forin:false */
                keys.push(key);
              }
            }

            iterator = new g.ArrayGenerator(keys)[symIt]();
            next = iterator.next();
            return {
              next: function () {
                var object;

                if (!next.done) {
                  object = {
                    done: false,
                    value: getYieldValue(opts, subject, next.value)
                  };

                  next = iterator.next();
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
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

            setValue(this, symIt, function () {
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

        RepeatGenerator: (function () {
          function repeatGenerator(subject) {
            return {
              next: function () {
                return {
                  done: false,
                  value: subject
                };
              }
            };
          }

          function RepeatGenerator(subject) {
            if (!(this instanceof RepeatGenerator)) {
              return new RepeatGenerator(subject);
            }

            setValue(this, symIt, function () {
              return repeatGenerator(subject);
            });
          }

          return RepeatGenerator;
        }()),

        UnzipGenerator: (function () {
          function unzipGenerator(array) {
            var iterator,
              first,
              next,
              rest;

            if (isArrayLike(array) || isFunction(array[symIt])) {
              first = reiterate(array).first();
              if (!isObjectLike(first)) {
                first = [];
              }

              rest = reiterate(array).rest().asArray();
            } else {
              first = rest = [];
            }

            iterator = p.zipGenerator.apply(
              reiterate(first, true),
              rest
            )[symIt]();

            next = iterator.next();
            return {
              next: function () {
                var object;

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  next = iterator.next();
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              }
            };
          }

          function UnzipGenerator(subject) {
            if (!(this instanceof UnzipGenerator)) {
              return new UnzipGenerator(subject);
            }

            setValue(this, symIt, function () {
              return unzipGenerator(subject);
            });
          }

          return UnzipGenerator;
        }())

      };

    populatePrototypes();

    return (function () {
      function makeCounterGenerator(subject, to, by) {
        var generator = new g.CounterGenerator();

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

      reiterate = function (subject, to, by) {
        var generator;

        if (isNil(subject) || isNumber(subject)) {
          generator = makeCounterGenerator(subject, to, by);
        } else if (isArray(subject, to)) {
          generator = new g.ArrayGenerator(subject);
        } else if (isString(subject)) {
          generator = new g.StringGenerator(subject);
        } else if (isFunction(subject[symIt])) {
          generator = new g.ThenGenerator(subject, {}, chop(arguments, 1));
        } else {
          generator = new g.EnumerateGenerator(subject);
        }

        return generator;
      };

      /*
       * Static methods
       */
      setValue(reiterate, 'array', g.ArrayGenerator);
      setValue(reiterate, 'string', g.StringGenerator);
      setValue(reiterate, 'enumerate', g.EnumerateGenerator);
      setValue(reiterate, 'repeat', g.RepeatGenerator);
      setValue(reiterate, 'unzip', g.UnzipGenerator);
      setValue(reiterate, 'iterator', symIt);

      return reiterate;
    }());
  }

));

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : (function () {
      function Bar () {}
      try {
        var arr = new Uint8Array(1)
        arr.foo = function () { return 42 }
        arr.constructor = Bar
        return arr.foo() === 42 && // typed array instances can be augmented
            arr.constructor === Bar && // constructor can be set
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
      } catch (e) {
        return false
      }
    })()

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  this.length = 0
  this.parent = undefined

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":4,"ieee754":5,"is-array":6}],4:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],5:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],6:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
(function (Buffer){
(function (global, module) {

  var exports = module.exports;

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.3.1';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this;

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          };

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  }

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error, expected) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth
      , err;

    if (!ok) {
      err = new Error(msg.call(this));
      if (arguments.length > 3) {
        err.actual = this.obj;
        err.expected = expected;
        err.showDiff = true;
      }
      throw err;
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Creates an anonymous function which calls fn with arguments.
   *
   * @api public
   */

  Assertion.prototype.withArgs = function() {
    expect(this.obj).to.be.a('function');
    var fn = this.obj;
    var args = Array.prototype.slice.call(arguments);
    return expect(function() { fn.apply(null, args); });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not;

    try {
      this.obj();
    } catch (e) {
      if (isRegExp(fn)) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      } else if ('function' == typeof fn) {
        fn(e);
      }
      thrown = true;
    }

    if (isRegExp(fn) && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(this.obj, obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
      , obj);
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'regexp' == type ? isRegExp(this.obj) :
              'object' == type
                ? 'object' == typeof this.obj && null !== this.obj
                : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };

  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    var error = function() { return msg || "explicit failure"; }
    this.assert(false, error, error);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  }

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    }

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }
      
      // Error objects can be shortcutted
      if (value instanceof Error) {
        return stylize("["+value.toString()+"]", 'Error');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  }

  expect.stringify = i;

  function isArray (ar) {
    return Object.prototype.toString.call(ar) === '[object Array]';
  }

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  }

  function isDate(d) {
    return d instanceof Date;
  }

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  }

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  }

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql(actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

      // 7.2. If the expected value is a Date object, the actual value is
      // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

      // 7.3. Other pairs that do not both pass typeof value == "object",
      // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;
    // If both are regular expression use the special `regExpEquiv` method
    // to determine equivalence.
    } else if (isRegExp(actual) && isRegExp(expected)) {
      return regExpEquiv(actual, expected);
    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  };

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function regExpEquiv (a, b) {
    return a.source === b.source && a.global === b.global &&
           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {exports: {}}
);

}).call(this,require("buffer").Buffer)
},{"buffer":3}],9:[function(require,module,exports){
(function (process){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:7,
    maxcomplexity:2
*/
/*global module, require, process */

(function () {
  'use strict';

  module.exports.expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/reiterate.min');
  } else {
    module.exports.subject = require('../lib/reiterate');
  }

  module.exports.isGeneratorSupported = (function () {
    try {
      /*jslint evil:true */
      eval('(function*(){})()');
      return true;
    } catch (ignore) {}

    return false;
  }());

  module.exports.isForOfSupported = (function () {
    try {
      /*jslint evil:true */
      eval("for (var e of ['a']) {}");
      return true;
    } catch (ignore) {}

    return false;
  }());
}());

}).call(this,require('_process'))
},{"../lib/reiterate":1,"../lib/reiterate.min":2,"_process":7,"expect.js":8}],10:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:12,
    maxcomplexity:1
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Initialise', function () {
      expect(function () {
        reiterate();
      }).to.not.throwException();

      expect(function () {
        reiterate(undefined);
      }).to.not.throwException();

      expect(function () {
        reiterate(null);
      }).to.not.throwException();

      expect(function () {
        reiterate(0);
      }).to.not.throwException();

      expect(function () {
        reiterate(false);
      }).to.not.throwException();

      expect(function () {
        reiterate('');
      }).to.not.throwException();

      expect(function () {
        reiterate([]);
      }).to.not.throwException();

      expect(function () {
        reiterate({});
      }).to.not.throwException();

      expect(function () {
        reiterate(function () {});
      }).to.not.throwException();

      expect(function () {
        reiterate(new Map());
      }).to.not.throwException();

      expect(function () {
        reiterate(new Set());
      }).to.not.throwException();

      expect(function () {
        reiterate(/a\ regex/);
      }).to.not.throwException();
    });
  });
}());

},{"../scripts/":9}],11:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:4, maxdepth:2, maxstatements:52,
    maxcomplexity:15
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  function* aGenerator() {
    var x = Array.prototype.reduce.call(arguments, function (acc, arg) {
        return acc + arg;
      }, 0),
      item;

    /*jshint validthis:true */
    for (item of this) {
      yield item * 2 + x;
    }
  }

  describe('Basic tests', function () {
    it('Counter simple', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(9)) {
        expect(entry).to.be.within(0, 9);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(undefined).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate(null).reverse()) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = -9;
      for (entry of reiterate(-9).reverse()) {
        expect(entry).to.be.within(-9, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter specific arguments', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 10;
      for (entry of reiterate(10, -20)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -20;
      for (entry of reiterate(-20, -10)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 1;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(-10, 0).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = -10;
      for (entry of reiterate(0, -10).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Counter with by', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate(0, 10, 1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate(-10, 0, 2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate(10, -20, 3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate(-20, -10, -2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate(0, 10, 1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate(10, 0, 2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate(-10, 0, 3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate(0, -10, -2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      }

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter simple mixed sugar', function () {
      var index = 10,
        entry;

      // forward
      for (entry of reiterate().from(10)) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 20) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(undefined).to(10)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          break;
        }
      }

      index = 0;
      for (entry of reiterate(null).by(2)) {
        expect(entry).to.be.within(0, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate().from(10).to(20).by(2)) {
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = Number.MAX_SAFE_INTEGER;
      for (entry of reiterate().from(10).reverse()) {
        expect(entry).to.be.within(10, Number.MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < Number.MAX_SAFE_INTEGER - 10) {
          break;
        }
      }

      index = 10;
      for (entry of reiterate(undefined).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 10;
      for (entry of reiterate().from(0).to(10).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 2;
      }
    });

    it('Counter using sugar', function () {
      var index = 0,
        entry;

      // NaN
      for (entry of reiterate().from(NaN).to(NaN).by(1)) {
        expect(entry).to.be(0);
        index += 1;
      }

      // forward
      index = 0;
      for (entry of reiterate().from(0).to(10).by(1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate().from(-10).to(0).by(2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate().from(10).to(-20).by(3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate().from(-20).to(-10).by(2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate().from(0).to(10).by(1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(10).to(0).by(2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate().from(0).to(-10).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter zeros', function () {
      var index = 0,
        entry;

      index = 0;
      for (entry of reiterate(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(0, 0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate(0, 0, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      index = 0;
      for (entry of reiterate().to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      index = 0;
      for (entry of reiterate().from(0).to(0)) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      }

      expect(function () {
        reiterate().from(0).to(0).by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate().by(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate().by(NaN);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter limits', function () {
      var entry;

      for (entry of reiterate().from(-Infinity).to(Infinity)) {
        expect(entry).to.be(Number.MIN_SAFE_INTEGER);
        break;
      }

      for (entry of reiterate().from(Infinity).to(-Infinity)) {
        expect(entry).to.be(Number.MAX_SAFE_INTEGER);
        break;
      }
    });

    it('Counter next', function () {
      var generator = reiterate().from(0).to(3).by(1),
        iterator = generator[Symbol.iterator]();

      expect(iterator.next()).to.eql({
        value: 0,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 1,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 2,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: 3,
        done: false
      });

      expect(iterator.next()).to.eql({
        value: undefined,
        done: true
      });
    });

    it('Counter already started', function () {
      var generator = reiterate(),
        iterator = generator[Symbol.iterator]();

      expect(iterator.next()).to.eql({
        value: 0,
        done: false
      });

      expect(function () {
        iterator.from(0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.to(3);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.by(1);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        iterator.reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter map', function () {
      var index,
        entry,
        counter;

      expect(function () {
        for (entry of reiterate().map()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 65;
      for (entry of counter) {
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Counter map filter', function () {
      var index,
        entry,
        counter;

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        }).filter(function (value) {
          return value >= 'P' && value <= 'U';
        });
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      index = 80;
      for (entry of counter) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Counter asArray', function () {
      var array;

      expect(function () {
        array = reiterate().to(3).asArray();
      }).to.not.throwException();

      expect(array).to.eql([0, 1, 2, 3]);
    });

    it('Counter map asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(65).to(68).map(function (value) {
          return String.fromCharCode(value);
        }).asArray();
      }).to.not.throwException();

      expect(array).to.eql(['A', 'B', 'C', 'D']);
    });

    it('Counter map unique asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).unique().asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql(['a']);
    });

    it('Counter map filter unique asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(10).map(function () {
          return 'a';
        }).filter(function () {
          return true;
        }).unique().asArray();
      }).to.not.throwException();

      expect(array).to.eql(['a']);
    });

    it('Counter then undefined', function () {
      var index = 0,
        value,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then();
      }).to.not.throwException();

      for (value of iterator) {
        expect(index).to.be.within(0, 10);
        expect(value).to.be(index);
        index += 1;
      }
    });

    it('Counter then aGenerator', function () {
      var index = 0,
        value,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then(aGenerator);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      for (value of iterator) {
        expect(index).to.be.within(0, 10);
        expect(value).to.be(index * 2);
        index += 1;
      }
    });

    it('Counter then asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator).asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql([0, 2, 4, 6]);
    });

    it('Counter then map asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator, 2)
          .map(function (value) {
            return value * 2;
          }).asArray();
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(array).to.eql([4, 8, 12, 16]);
    });

    it('Counter then filter asArray', function () {
      var array;

      expect(function () {
        array = reiterate().from(0).to(3).then(aGenerator, 1)
          .filter(function (value) {
            return value >= 3 && value <= 5;
          }).asArray();
      }).to.not.throwException();

      expect(array).to.eql([3, 5]);
    });

    it('Counter using sugar', function () {
      var index = 0,
        entry;

      // forward
      for (entry of reiterate().from(0).to(10).by(1)) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      }

      index = -10;
      for (entry of reiterate().from(-10).to(0).by(2)) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 10;
      for (entry of reiterate().from(10).to(-20).by(3)) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -20;
      for (entry of reiterate().from(-20).to(-10).by(2)) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      }

      // reverse
      index = 10;
      for (entry of reiterate().from(0).to(10).by(1).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      }

      index = 0;
      for (entry of reiterate().from(10).to(0).by(2).reverse()) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      }

      index = 0;
      for (entry of reiterate().from(-10).to(0).by(3).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      }

      index = -10;
      for (entry of reiterate().from(0).to(-10).by(-2).reverse()) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      }
    });

    it('Counter tap', function () {
      var index = 10,
        array;

      expect(function () {
        var entry;

        for (entry of reiterate().tap()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      array = reiterate().from(10).to(20).tap(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      }).asArray();

      expect(array).to.eql([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
      index = 10;
      reiterate().from(10).to(20).tap(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
      }, true);

      // reverse
      index = 20;
      array = reiterate().from(10).to(20).reverse().tap(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      }).asArray();

      expect(array).to.eql([20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10]);
      index = 20;
      reiterate().from(10).to(20).reverse().tap(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index -= 1;
      }, true);
    });

    it('Counter reduce', function () {
      var index = 10,
        r;

      expect(function () {
        var entry;

        for (entry of reiterate().reduce()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      // forward
      r = reiterate().from(10).to(20).reduce(function (acc, entry) {
        expect(acc).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return acc;
      }, undefined);

      expect(r).to.be(undefined);
      index = 11;
      r = reiterate().from(10).to(20).reduce(function (acc, entry) {
        expect(acc).to.be.a('number');
        expect(entry).to.be.within(11, 20);
        expect(entry).to.be(index);
        index += 1;
        return acc;
      });

      expect(r).to.be(10);
      index = 10;
      r = reiterate().from(10).to(20).reduce(
        function (acc, entry) {
          expect(acc).to.be.an('array');
          expect(entry).to.be.within(10, 20);
          expect(entry).to.be(index);
          index += 1;
          acc.push(entry);
          return acc;
        }, []
      );

      expect(r).to.eql(reiterate().from(10).to(20).asArray());

      // reverse
      index = 12;
      r = reiterate().from(10).to(12).reverse().reduce(function (acc, entry) {
        expect(acc).to.be.an('object');
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        acc[12 - index] = entry;
        index -= 1;
        return acc;
      }, {});

      expect(r).to.eql({
        0: 12,
        1: 11,
        2: 10
      });

      index = 19;
      r = reiterate().to(20).reverse().reduce(
        function (acc, entry) {
          expect(acc).to.be.a('number');
          expect(entry).to.be.within(0, 19);
          expect(entry).to.be(index);
          index -= 1;
          return acc + entry;
        }
      );

      expect(r).to.be(210);
    }, 0);

    it('Counter join', function () {
      var s;

      // forward
      s = reiterate().from(0).to(2).join();
      expect(s).to.be('0,1,2');

      // reverse
      s = reiterate().from(0).to(2).reverse().join();
      expect(s).to.be('2,1,0');
    });

    it('Counter state', function () {
      var gen = reiterate().from(1).to(100).by(2).reverse(),
        state = gen.state();

      expect(state).to.eql({
        reversed: true,
        from: 1,
        to: 100,
        by: 2
      });

      gen = reiterate().from(-Infinity).to(Infinity).by(Infinity);
      state = gen.state();

      expect(state).to.eql({
        reversed: false,
        from: Number.MIN_SAFE_INTEGER,
        to: Number.MAX_SAFE_INTEGER,
        by: Number.MAX_SAFE_INTEGER
      });
    });
  });
}());

},{"../scripts/":9}],12:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:56,
    maxcomplexity:10
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate(a)) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate([]).values()) {
        index += 1;
      }

      expect(index).to.be(0);

      index = 0;
      for (entry of reiterate(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate(a).reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }

      // unique
      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().unique().asSet();
      expect(array.size).to.be(b.length);
      array.forEach(function (item) {
        expect(b.indexOf(item)).to.not.be(-1);
      });

      // map
      array = reiterate(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(a.map(function (item) {
        return String(item);
      }));

      array = reiterate(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(a.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate(d).values().flatten().asArray();
      expect(array).to.eql(a);
    });

    it('Array slice', function () {
      var a = [1, 2, 3, 4, 5],
        gen = reiterate(a).keys().slice(1, -1),
        entry,
        index;

      // forward
      index = 1;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index += 1;
      }

      gen = reiterate(a).keys().slice(-1);
      for (entry of gen) {
        expect(entry).to.eql(4);
      }

      gen = reiterate(a).keys().slice(1, 3);
      index = 1;
      for (entry of gen) {
        expect(entry).to.be.within(1, 3);
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      gen = reiterate(a).keys().slice(1, -1).reverse();
      index = a.length - 2;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index -= 1;
      }
    });

    it('Array filter', function () {
      var a = [1, 2, 3, 4, 5],
        index,
        entry,
        counter;

      expect(function () {
        for (entry of reiterate(a).filter()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate(a).filter(function (value) {
          return value >= 2 && value <= 4;
        });
      }).to.not.throwException();

      index = 2;
      for (entry of counter) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.be(index);
        index += 1;
      }
    });

    it('Array filter map', function () {
      var a = reiterate().from(65).to(90).asArray(),
        index,
        entry,
        counter;

      expect(function () {
        counter = reiterate(a).filter(function (value) {
          return value >= 80 && value <= 85;
        }).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 80;
      for (entry of counter) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      }
    });

    it('Array filter asArray', function () {
      var a = reiterate().to(10).asArray(),
        array;

      expect(function () {
        array = reiterate(a).values().filter(function (value) {
          return value >= 4 && value <= 6;
        }).asArray();
      }).to.not.throwException();

      expect(array).to.eql([4, 5, 6]);
    });

    it('Counter every', function () {
      var index = 10,
        a = reiterate().from(10).to(20).asArray(),
        e;

      expect(function () {
        var entry;

        for (entry of reiterate(a).every()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });


      e = reiterate(a).values().every(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'number';
      });

      expect(e).to.be(true);
      index = 10;
      e = reiterate(a).values().every(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return typeof entry === 'string';
      }, true);

      expect(e).to.be(false);
    });

    it('Array some', function () {
      var a = reiterate().from(10).to(20).asArray(),
        index = 10,
        s;

      expect(function () {
        var entry;

        for (entry of reiterate(a).some()) {
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      s = reiterate(a).values().some(function (entry) {
        expect(this).to.be(undefined);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 15;
      });

      expect(s).to.be(true);
      index = 10;
      s = reiterate(a).values().some(function (entry) {
        expect(this).to.be(true);
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 1;
        return entry === 0;
      }, true);

      expect(s).to.be(false);
    });

    it('Array drop', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().drop().asArray();
      expect(array).to.eql(a);

      // forward
      array = reiterate(a).values().drop(2).asArray();
      expect(array).to.eql([3, 4, 5]);

      // reverse
      array = reiterate(a).values().reverse().drop(2).asArray();
      expect(array).to.eql([3, 2, 1]);
    });

    it('Array take', function () {
      var a = [1, 2, 3, 4, 5],
        array;

      // zero
      array = reiterate(a).values().take().asArray();
      expect(array).to.eql([]);

      // forward
      array = reiterate(a).values().take(2).asArray();
      expect(array).to.eql([1, 2]);

      // reverse
      array = reiterate(a).values().reverse().take(2).asArray();
      expect(array).to.eql([5, 4]);
    });

    it('Array state', function () {
      var gen = reiterate([]).keys().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: false,
        keys: true
      });
    });
  });
}());

},{"../scripts/":9}],13:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:28,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('UTF-16 string', function () {
      var a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A',
        b = ['A', '\uD835\uDC68', 'B', '\uD835\uDC69', 'C', '\uD835\uDC6A'],
        c = [0, 1, 3, 4, 6, 7],
        d = [
          [0, 'A'],
          [1, '\uD835\uDC68'],
          [3, 'B'],
          [4, '\uD835\uDC69'],
          [6, 'C'],
          [7, '\uD835\uDC6A']
        ],
        e = b.map(function (item) {
          return item.codePointAt();
        }),
        array = reiterate(a).values().asArray(),
        string = reiterate(a).values().asString(),
        iterator = reiterate(a).values().map(function (item) {
          return item.codePointAt();
        }),
        index = 0,
        entry;

      // forward
      index = 0;
      for (entry of reiterate('').values()) {
        index += 1;
      }

      expect(index).to.be(0);

      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate(a).keys().asArray();
      expect(array).to.eql(c);
      array = reiterate(a).entries().asArray();
      expect(array).to.eql(d);
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index += 1;
      }

      // reverse
      string = reiterate(a).values().reverse().asString();
      b.reverse();
      expect(string).to.be(b.join(''));
      array = reiterate(a).values().reverse().asArray();
      expect(array).to.eql(b);
      array = reiterate(a).keys().reverse().asArray();
      expect(array).to.eql(c.reverse());
      array = reiterate(a).entries().reverse().asArray();
      expect(array).to.eql(d.reverse());
      iterator = reiterate(a).values().reverse().map(function (item) {
        return item.codePointAt();
      });

      index = b.length - 1;
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index -= 1;
      }
    });

    it('String chars', function () {
      var a =
        '\uD835\uDC68\uD835\uDC69\uD835\uDC6A\uD835\uDC6B\uD835\uDC6C',
        gen = reiterate(a).keys().slice(1, -3),
        entry,
        index;

      // forward
      index = 2;
      for (entry of gen) {
        expect(entry).to.be.within(2, a.length - 4);
        expect(entry).to.eql(index);
        index += 2;
      }

      gen = reiterate(a).keys().slice(-3);
      for (entry of gen) {
        expect(entry).to.eql(8);
      }

      gen = reiterate(a).keys().slice(1, 3);
      index = 2;
      for (entry of gen) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.eql(index);
        index += 2;
      }

      // reverse
      gen = reiterate(a).keys().slice(1, -3).reverse();
      index = a.length - 4;
      for (entry of gen) {
        expect(entry).to.be.within(1, a.length - 4);
        expect(entry).to.eql(index);
        index -= 2;
      }
    });

    it('String state', function () {
      var gen = reiterate('').values().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: true,
        keys: false
      });
    });
  });
}());

},{"../scripts/":9}],14:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('ArrayLike of primatives', function () {
      var a = {
          0: 1,
          1: 2,
          2: 3,
          3: 5,
          4: 1,
          5: 3,
          6: 1,
          7: 2,
          8: 4,
          length: 9
        },
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        e = {
          0: 1,
          1: {
            0: 2,
            length: 1
          },
          2: 3,
          3: 5,
          4: {
            0: 1,
            1: 3,
            2: {
              0: 1,
              length: 1
            },
            length: 3
          },
          5: 2,
          6: {
            0: 4,
            length: 1
          },
          length: 7
        },
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate(a, true)) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a, true).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate(a, true).reverse()) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate(a, true).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }

      // unique
      array = reiterate(a, true).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a, true).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate(a, true).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(d.map(function (item) {
        return String(item);
      }));

      array = reiterate(a, true).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(d.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a, true).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.filter(function (item) {
        return item === 1;
      }));

      array = reiterate(a, true).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate(e, true).values().flatten(true).asArray();
      expect(array).to.eql(d);
    });

    it('Array-like state', function () {
      var gen = reiterate({length: 0}, true).entries().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: true,
        values: false,
        keys: false
      });

      gen = reiterate({length: Number.MAX_SAFE_INTEGER}, true);
      state = gen.state();
      expect(state).to.eql({
        length: Number.MAX_SAFE_INTEGER,
        from: 0,
        to: Number.MAX_SAFE_INTEGER - 1,
        by: 1,
        reversed: false,
        entries: false,
        values: true,
        keys: false
      });
    });
  });
}());

},{"../scripts/":9}],15:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:17,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    var a = {
        0: 1,
        1: 2,
        2: 3,
        3: 5,
        4: 1,
        5: 3,
        6: 1,
        7: 2,
        8: 4
      },
      b = [1, 2, 3, 5, 1, 3, 1, 2, 4],
      c = {
        0: 1,
        1: [2],
        2: 3,
        3: 5,
        4: [1, 3, [1]],
        5: 2,
        6: [4]
      },
      index,
      entry,
      array;

    it('Object enumerate, no length', function () {
      // forward
      index = 0;
      for (entry of reiterate(a)) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      expect(function () {
        reiterate(a).reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own, no length', function () {
      // forward
      index = 0;
      for (entry of reiterate(a).own()) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).own().entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).own().values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate(a).own().keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      expect(function () {
        reiterate(a).own().reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own flatten, no length', function () {
      array = reiterate(c).own().values().flatten().asArray();
      expect(array).to.eql(b);
    });

    it('Object state', function () {
      var gen = reiterate({}).own(),
        state = gen.state();

      expect(state).to.eql({
        entries: false,
        values: true,
        keys: false,
        own: true
      });
    });
  });
}());

},{"../scripts/":9}],16:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic static tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate.array(a)) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate.array(a).reverse()) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }

      // unique
      array = reiterate.array(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate.array(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate.array(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(a.map(function (item) {
        return String(item);
      }));

      array = reiterate.array(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(a.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate(a).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.filter(function (item) {
        return item === 1;
      }));

      array = reiterate.array(a).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(a.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate.array(d).values().flatten().asArray();
      expect(array).to.eql(a);
    });

    it('Array state', function () {
      var gen = reiterate.array([]).keys().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: false,
        keys: true
      });
    });
  });
}());

},{"../scripts/":9}],17:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:24,
    maxcomplexity:3
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic static tests', function () {
    it('UTF-16 string', function () {
      var a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A',
        b = ['A', '\uD835\uDC68', 'B', '\uD835\uDC69', 'C', '\uD835\uDC6A'],
        c = [0, 1, 3, 4, 6, 7],
        d = [
          [0, 'A'],
          [1, '\uD835\uDC68'],
          [3, 'B'],
          [4, '\uD835\uDC69'],
          [6, 'C'],
          [7, '\uD835\uDC6A']
        ],
        e = b.map(function (item) {
          return item.codePointAt();
        }),
        array = reiterate.string(a).values().asArray(),
        string = reiterate.string(a).values().asString(),
        iterator = reiterate.string(a).values().map(function (item) {
          return item.codePointAt();
        }),
        index = 0,
        entry;

      // forward
      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate.string(a).keys().asArray();
      expect(array).to.eql(c);
      array = reiterate.string(a).entries().asArray();
      expect(array).to.eql(d);
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index += 1;
      }

      // reverse
      string = reiterate.string(a).values().reverse().asString();
      b.reverse();
      expect(string).to.be(b.join(''));
      array = reiterate.string(a).values().reverse().asArray();
      expect(array).to.eql(b);
      array = reiterate.string(a).keys().reverse().asArray();
      expect(array).to.eql(c.reverse());
      array = reiterate.string(a).entries().reverse().asArray();
      expect(array).to.eql(d.reverse());
      iterator = reiterate.string(a).values().reverse().map(function (item) {
        return item.codePointAt();
      });

      index = b.length - 1;
      for (entry of iterator) {
        expect(entry).to.be(e[index]);
        index -= 1;
      }
    });

    it('String state', function () {
      var gen = reiterate.string('').values().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: false,
        values: true,
        keys: false
      });
    });
  });
}());

},{"../scripts/":9}],18:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic static tests', function () {
    it('ArrayLike of primatives', function () {
      var a = {
          0: 1,
          1: 2,
          2: 3,
          3: 5,
          4: 1,
          5: 3,
          6: 1,
          7: 2,
          8: 4,
          length: 9
        },
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        e = {
          0: 1,
          1: {
            0: 2,
            length: 1
          },
          2: 3,
          3: 5,
          4: {
            0: 1,
            1: 3,
            2: {
              0: 1,
              length: 1
            },
            length: 3
          },
          5: 2,
          6: {
            0: 4,
            length: 1
          },
          length: 7
        },
        index = 0,
        entry,
        array;

      // forward
      for (entry of reiterate.array(a)) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.array(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      index = a.length - 1;
      for (entry of reiterate.array(a).reverse()) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).entries().reverse()) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).values().reverse()) {
        expect(entry).to.be(a[index]);
        index -= 1;
      }

      index = a.length - 1;
      for (entry of reiterate.array(a).keys().reverse()) {
        expect(entry).to.eql(index);
        index -= 1;
      }

      // unique
      array = reiterate.array(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate.array(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate.array(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(d.map(function (item) {
        return String(item);
      }));

      array = reiterate.array(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(d.slice().reverse().map(function (item) {
        return String(item);
      }));

      // filter
      array = reiterate.array(a).values().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.filter(function (item) {
        return item === 1;
      }));

      array = reiterate.array(a).values().reverse().filter(function (item) {
        return item === 1;
      }).asArray();

      expect(array).to.eql(d.slice().reverse().filter(function (item) {
        return item === 1;
      }));

      // flatten
      array = reiterate.array(e).values().flatten(true).asArray();
      expect(array).to.eql(d);
    });

    it('Array-like state', function () {
      var gen = reiterate.array({
          length: 0
        }).entries().reverse(),
        state = gen.state();

      expect(state).to.eql({
        length: 0,
        from: 0,
        to: -1,
        by: 1,
        reversed: true,
        entries: true,
        values: false,
        keys: false
      });
    });
  });
}());

},{"../scripts/":9}],19:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:17,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic static tests', function () {
    var a = {
        0: 1,
        1: 2,
        2: 3,
        3: 5,
        4: 1,
        5: 3,
        6: 1,
        7: 2,
        8: 4
      },
      b = [1, 2, 3, 5, 1, 3, 1, 2, 4],
      c = {
        0: 1,
        1: [2],
        2: 3,
        3: 5,
        4: [1, 3, [1]],
        5: 2,
        6: [4]
      },
      index,
      entry,
      array;

    it('Object enumerate, no length', function () {
      // forward
      index = 0;
      for (entry of reiterate.enumerate(a)) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      expect(function () {
        reiterate.enumerate(a).reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own, no length', function () {
      // forward
      index = 0;
      for (entry of reiterate.enumerate(a).own()) {
        expect(entry).to.eql(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).own().entries()) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).own().values()) {
        expect(entry).to.be(a[index]);
        index += 1;
      }

      index = 0;
      for (entry of reiterate.enumerate(a).own().keys()) {
        expect(entry).to.eql(index);
        index += 1;
      }

      // reverse
      expect(function () {
        reiterate.enumerate(a).own().reverse();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Object enumerate own flatten, no length', function () {
      array = reiterate.enumerate(c).own().values().flatten().asArray();
      expect(array).to.eql(b);
    });

    it('Object state', function () {
      var gen = reiterate.enumerate({}).own(),
        state = gen.state();

      expect(state).to.eql({
        entries: false,
        values: true,
        keys: false,
        own: true
      });
    });
  });
}());

},{"../scripts/":9}],20:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Array then defined but not a function', function () {
      function noop() {}

      expect(function () {
        for (var entry of reiterate([]).then(null)) {
          noop(entry);
          break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Array circular', function () {
      var a = [1];

      a.push(a);

      function noop() {}

      expect(function () {
        for (var entry of reiterate(a).flatten()) {
          noop(entry);
          //break;
        }
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });
  });
}());

},{"../scripts/":9}],21:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic static tests', function () {
    it('Repeat', function () {
      expect(reiterate.repeat('a').take(5).asArray()).to.eql([
        'a',
        'a',
        'a',
        'a',
        'a'
      ]);

      expect(reiterate.repeat('a').take(5).asString()).to.be('aaaaa');
    });
  });
}());

},{"../scripts/":9}],22:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('takeWhile', function () {
      var a = [1, 2, 3, 4, 1, 2, 3, 4],
        array = reiterate(a).values().takeWhile(function (item) {
          return item < 4;
        }).asArray();

      expect(array).to.eql([1, 2, 3]);
    });
  });
}());

},{"../scripts/":9}],23:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('dropWhile', function () {
      var a = [1, 2, 3, 4, 1, 2, 3, 4],
        array = reiterate(a).values().dropWhile(function (item) {
          return item < 4;
        }).asArray();

      expect(array).to.eql([4, 1, 2, 3, 4]);
    });
  });
}());

},{"../scripts/":9}],24:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Chunk', function () {
      var array = reiterate().to(10).chunk(3).asArray();

      expect(array).to.eql([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10]]);
    });
  });
}());

},{"../scripts/":9}],25:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Compact', function () {
      var a = [0, 1, false, 2, '', 3, undefined, 4, null, 5, NaN, 6],
        array = reiterate(a).values().compact().asArray();

      expect(array).to.eql([1, 2, 3, 4, 5, 6]);
    });
  });
}());

},{"../scripts/":9}],26:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Difference', function () {
      var a = [1, 2, 3, 4, 5],
        array = reiterate(a).values().difference([4, 2]).asArray();

      expect(array).to.eql([1, 3, 5]);
      array = reiterate(a).values().difference([4, 2]).asObject();
      expect(array).to.eql({
        0: 1,
        1: 3,
        2: 5
      });

      expect(array.length).to.be(3);
      array = reiterate(a).values().difference([4, 2]).asMap();
      expect(array.size).to.be(3);
      expect(array.get(0)).to.be(1);
      expect(array.get(1)).to.be(3);
      expect(array.get(2)).to.be(5);
      array = reiterate(a).values().difference({
        'a': 4,
        'b': 2
      }).asArray();

      expect(array).to.eql([1, 3, 5]);
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      array = reiterate(a).values().difference('A\uD835\uDC69B').asString();
      expect(array).to.be('\uD835\uDC68C\uD835\uDC6A');
      array = reiterate(a).values().difference('A\uD835\uDC69B').asArray();
      expect(array).to.eql(['\uD835\uDC68', 'C', '\uD835\uDC6A']);
      array = reiterate(a).values().difference('A\uD835\uDC69B').join();
      expect(array).to.be('\uD835\uDC68,C,\uD835\uDC6A');
    });
  });
}());

},{"../scripts/":9}],27:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Other iterables', function () {
      var a = new Map().set(0, 1).set(1, 2).set(2, 3),
        array = reiterate(a).asArray();

      expect(array).to.eql([
        [0, 1],
        [1, 2],
        [2, 3]
      ]);
      array = reiterate(a.values()).asArray();
      expect(array).to.eql([1, 2, 3]);
      array = reiterate(a.keys()).asArray();
      expect(array).to.eql([0, 1, 2]);
      a = new Set().add(0).add(1).add(2);
      array = reiterate(a).asArray();
      expect(array).to.eql([0, 1, 2]);

      a = {
        a: 1,
        b: 2,
        c: 3
      };

      a[Symbol.iterator] = function* () {
        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            yield this[key];
          }
        }
      };

      array = reiterate(a).asArray();
      expect(array).to.eql([1, 2, 3]);

      a[Symbol.iterator] = function* () {
        for (var key in this) {
          if (this.hasOwnProperty(key)) {
            yield key;
          }
        }
      };

      array = reiterate(a).asArray();
      expect(array).to.eql(['a', 'b', 'c']);

      array = reiterate(a).join();
      expect(array).to.be('a,b,c');

      array = reiterate(a).asString();
      expect(array).to.be('abc');
    });
  });
}());

},{"../scripts/":9}],28:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Initial', function () {
      var a = [1, 2, 3, 4, 5],
        array = reiterate(a).values().initial().asArray();

      expect(array).to.eql([1, 2, 3, 4]);
      array = reiterate(a).values().initial().asObject();
      expect(array).to.eql({
        0: 1,
        1: 2,
        2: 3,
        3: 4
      });

      expect(array.length).to.be(4);
      array = reiterate(a).values().initial().asMap();
      expect(array.size).to.be(4);
      expect(array.get(0)).to.be(1);
      expect(array.get(1)).to.be(2);
      expect(array.get(2)).to.be(3);
      expect(array.get(3)).to.be(4);
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      array = reiterate(a).values().initial().asString();
      expect(array).to.be('A\uD835\uDC68B\uD835\uDC69C');
      array = reiterate(a).values().initial().asArray();
      expect(array).to.eql([
        'A',
        '\uD835\uDC68',
        'B',
        '\uD835\uDC69',
        'C'
      ]);

      array = reiterate(a).values().initial().join();
      expect(array).to.be('A,\uD835\uDC68,B,\uD835\uDC69,C');
    });
  });
}());

},{"../scripts/":9}],29:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('First', function () {
      var a = [
          [
            ['a', 'b', 'c', 'd', 'e'], 1, 2, 3, 4, 5
          ], 1, 2, 3, 4, 5
        ],
        value = reiterate(a).values().flatten().first();

      expect(value).to.be('a');
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      value = reiterate(a).values().first();
      expect(value).to.be('A');
    });
  });
}());

},{"../scripts/":9}],30:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Last', function () {
      var a = [
          [
            ['a', 'b', 'c', 'd', 'e'], 1, 2, 3, 4, 5
          ],
          1, 2, 3, 4, 5, ['a', 'b', 'c', 'd', 'e']
        ],
        value = reiterate(a).values().flatten().last();

      expect(value).to.be('e');
      a = 'A\uD835\uDC6A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      value = reiterate(a).values().unique().last();
      expect(value).to.be('C');
    });
  });
}());

},{"../scripts/":9}],31:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Rest', function () {
      var a = [1, 2, 3, 4, 5],
        array = reiterate(a).values().rest().asArray();

      expect(array).to.eql([2, 3, 4, 5]);
      array = reiterate(a).values().rest().asObject();
      expect(array).to.eql({
        0: 2,
        1: 3,
        2: 4,
        3: 5
      });

      expect(array.length).to.be(4);
      array = reiterate(a).values().rest().asMap();
      expect(array.size).to.be(4);
      expect(array.get(0)).to.be(2);
      expect(array.get(1)).to.be(3);
      expect(array.get(2)).to.be(4);
      expect(array.get(3)).to.be(5);
      a = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A';
      array = reiterate(a).values().rest().asString();
      expect(array).to.be('\uD835\uDC68B\uD835\uDC69C\uD835\uDC6A');
      array = reiterate(a).values().rest().asArray();
      expect(array).to.eql([
        '\uD835\uDC68',
        'B',
        '\uD835\uDC69',
        'C',
        '\uD835\uDC6A'
      ]);

      array = reiterate(a).values().rest().join();
      expect(array).to.be('\uD835\uDC68,B,\uD835\uDC69,C,\uD835\uDC6A');
    });
  });
}());

},{"../scripts/":9}],32:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Union', function () {
      var a = reiterate().to(3),
        b = reiterate().from(3).to(6),
        c = reiterate().from(6).to(9),
        d = reiterate().to(10),
        value = reiterate(a).union(b, c, d).asArray();

      expect(value).to.eql(reiterate().to(10).asArray());
      a = reiterate([0, 1, 2]).values();
      b = reiterate([4, 5, 6]).values();
      c = reiterate([8, 9]).values();
      d = reiterate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).values();
      value = reiterate(a).union(b, c, d).asArray();
      expect(value).to.eql([0, 1, 2, 4, 5, 6, 8, 9, 3, 7, 10]);
      a = reiterate().to(3);
      b = reiterate().from(3).to(6);
      c = reiterate().from(6).to(9);
      d = reiterate().to(10);
      value = reiterate(a).union(b, c, d).asSet();
      expect(value.size).to.be(11);
      expect(value.has(0)).to.be(true);
      expect(value.has(1)).to.be(true);
      expect(value.has(2)).to.be(true);
      expect(value.has(3)).to.be(true);
      expect(value.has(4)).to.be(true);
      expect(value.has(5)).to.be(true);
      expect(value.has(6)).to.be(true);
      expect(value.has(7)).to.be(true);
      expect(value.has(8)).to.be(true);
      expect(value.has(9)).to.be(true);
      expect(value.has(10)).to.be(true);
      value = reiterate([]).union().asArray();
      expect(value).to.eql([]);
      value = reiterate([1]).union().asArray();
      expect(value).to.eql([1]);
      value = reiterate([]).union([1]).asArray();
      expect(value).to.eql([1]);
      value = reiterate([]).union().asSet();
      expect(value).to.eql([]);
      value = reiterate([]).union([]).asSet();
      expect(value.size).to.be(0);
      value = reiterate([]).union([1]).asSet();
      expect(value.size).to.be(1);
      value = reiterate([1]).union().asSet();
      expect(value.size).to.be(1);
    });
  });
}());

},{"../scripts/":9}],33:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Intersection', function () {
      var a = reiterate([4, 2]).values(),
        b = reiterate([2, 1]).values(),
        array = reiterate([1, 2]).values().intersection(a, b).asArray();

      expect(array).to.eql([2]);

      a = reiterate([5, 2, 1, 4]).values();
      b = reiterate([2, 1]).values();
      array = reiterate([1, 3, 2]).values().intersection(a, b).asArray();
      expect(array).to.eql([1, 2]);

      a = reiterate([5, 2, 2, 1, 4]).values();
      b = reiterate([2, 1, 1]).values();
      array = reiterate([1, 1, 3, 2, 2]).values().intersection(a, b).asArray();
      expect(array).to.eql([1, 2]);

      a = reiterate([1, NaN, 3]).values();
      b = reiterate([NaN, 5, NaN]).values();
      array = reiterate([1, 3, NaN, 2]).values().intersection(a, b).asArray();
      expect(array.length).to.be(1);
      expect(array[0]).to.not.be(array[0]);

      array = reiterate([1, 1, 3, 2, 2]).values().intersection().asArray();
      expect(array).to.eql([1, 3, 2]);

      a = reiterate([5, 2, 2, 1, 4]).values();
      b = reiterate([2, 1, 1]).values();
      array = reiterate([1, 1, 3, 2, 2]).values().intersection(a, b).asSet();
      expect(array.size).to.be(2);
      expect(array.has(1)).to.be(true);
      expect(array.has(2)).to.be(true);
    });
  });
}());

},{"../scripts/":9}],34:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:56,
    maxcomplexity:9
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Zip', function () {
      var a = [30, 40],
        b = [true, false],
        i = ['fred', 'barney'],
        array = reiterate(i).zip(a, b).asArray(),
        x,
        y,
        u;

      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([i, a, b]);

      x = reiterate(a);
      y = reiterate(b);
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([i, a, b]);

      x = reiterate([30]);
      y = reiterate(b);
      i = ['fred', 'barney', 'wilma'];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined],
        [true, false, undefined]
      ]);

      x = reiterate([30]);
      y = {
        a: true,
        b: false
      };

      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30],
        ['barney', undefined],
        ['wilma', undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined]
      ]);

      x = reiterate([30]);
      y = reiterate({
        a: true,
        b: false
      });

      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, true],
        ['barney', undefined, false],
        ['wilma', undefined, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, undefined, undefined],
        [true, false, undefined]
      ]);

      x = a;
      y = [];
      i = ['fred', 'barney'];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        ['fred', 30, undefined],
        ['barney', 40, undefined]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        i, [30, 40],
        [undefined, undefined]
      ]);

      x = a;
      y = b;
      i = [];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([
        [undefined, 30, true],
        [undefined, 40, false]
      ]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([
        [undefined, undefined],
        [30, 40],
        [true, false]
      ]);

      x = [];
      y = [];
      array = reiterate(i).zip(x, y).asArray();
      expect(array).to.eql([]);

      u = reiterate.unzip(array).asArray();
      expect(u).to.eql([]);

      x = ['fred', 30, true];
      y = ['barney', 40, false];
      u = reiterate.unzip({a: x, b: y}).asArray();
      expect(u).to.eql([]);

      i = ['fred', 'barney'];
      u = reiterate.unzip(reiterate({a: x, b: y})).asArray();
      expect(u).to.eql([i, a, b]);
    });
  });
}());

},{"../scripts/":9}]},{},[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34]);
