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
    es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:6,
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

  var useShims = false,

    typeFunction = typeof factory,

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

      if (!fn || useShims) {
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
      return factory(isObject, defineProperty, useShims);
    });

  } else if (typeof module === typeObject && module.exports) {
    /*
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory(isObject, defineProperty, useShims);
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
      value: factory(isObject, defineProperty, useShims)
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
  function (isObject, defineProperty, useShims) {
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
        return typeof Symbol === typeFunction && !useShims ?
          Symbol.iterator :
          '@@iterator';
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
        return function (object, property, value, noCheck) {
          if (!noCheck && hasOwn(object, property)) {
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

        if (ms && !useShims) {
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

        if (nin && !useShims) {
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

        if (nif && !useShims) {
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

        if (ai && !useShims) {
          fn = ai;
        } else if (tag === '[object Array]' && !useShims) {
          fn = function (subject) {
            return isArrayLike(subject) && toStringTag(subject) === tag;
          };
        } else {
          fn = function (subject) {
            return isArrayLike(subject) &&
              !isString(subject) &&
              hasOwn(subject, 'length') &&
              !hasOwn(subject, 'callee');
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

        if (spc && !useShims) {
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

        if (sf && !useShims) {
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

        if (apm && !useShims) {
          fn = function (array) {
            return aps.apply(array, chop(arguments, 1));
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

        if (apf && !useShims) {
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

        if (apf && !useShims) {
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

        if (apr && !useShims) {
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

        if (ape && !useShims) {
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

        if (ok && !useShims) {
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

        if (oa && !useShims) {
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

        if (api && !useShims) {
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
        var S = typeof Set === typeFunction && !useShims && Set,
          fn,
          s;

        if (S) {
          try {
            s = new S([1]);
            if (!s.has(1) ||
              s.size !== 1 ||
              !s.keys ||
              !s.values ||
              !s.entries ||
              !s.forEach ||
              !s.clear ||
              !s[symIt]) {
              throw new Error();
            }
          } catch (e) {
            S = null;
          }
        }

        if (S) {
          fn = S;
        } else {
          fn = function (iterable) {
            var iterator,
              next;

            setValue(this, '_keys', []);
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
                if (!includes(this._keys, next.value)) {
                  this._keys.push(next.value);
                }

                next = iterator.next();
              }
            }

            setValue(this, 'size', this._keys.length);
          };

          setValue(fn.prototype, 'has', function (key) {
            return includes(this._keys, key);
          });

          setValue(fn.prototype, 'add', function (key) {
            if (!includes(this._keys, key)) {
              this._keys.push(key);
              this.size = this._keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'clear', function () {
            this._keys.length = this.size = 0;
            return this;
          });

          setValue(fn.prototype, strDelete, function (key) {
            var index = getIndex(this._keys, key);

            if (-1 < index) {
              this._keys.splice(index, 1);
              this.size = this._keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            forEach(this._keys, callback, thisArg);

            return this;
          });

          setValue(fn.prototype, 'values', function () {
            var keys = this._keys;

            function SetIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'values');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

                if (index < length) {
                  object = {
                    done: false,
                    value: keys[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              });
            }

            return new SetIterator();
          });

          setValue(fn.prototype, 'keys', function () {
            var keys = this._keys;

            function SetIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'keys');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

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
              });
            }

            return new SetIterator();
          });

          setValue(fn.prototype, 'entries', function () {
            var keys = this._keys;

            function SetIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'entries');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

                if (index < length) {
                  object = {
                    done: false,
                    value: [index, keys[index]]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              });
            }

            return new SetIterator();
          });

          setValue(fn.prototype, symIt, function () {
            return this.values();
          });
        }

        return fn;
      }(typeof isObject)),

      MapObject = (function (typeFunction) {
        var M = typeof Map === typeFunction && !useShims && Map,
          fn,
          m;

        if (M) {
          try {
            m = new M([[0, 1]]);
            if (!m.has(0) ||
              m.size !== 1 ||
              !m.keys ||
              !m.values ||
              !m.entries ||
              !m.forEach ||
              !m.clear ||
              !m[symIt]) {
              throw new Error();
            }
          } catch (e) {
            M = null;
          }
        }

        if (M) {
          fn = M;
        } else {
          fn = function (iterable) {
            var iterator,
              index,
              next;

            setValue(this, '_keys', []);
            setValue(this, '_values', []);
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
                index = getIndex(this._keys, next.value[0]);
                if (-1 < index) {
                  this._keys.push(next.value[0]);
                  this._values.push(next.value[1]);
                } else {
                  this._values[index] = next.value[1];
                }

                next = iterator.next();
              }
            }

            setValue(this, 'size', this._keys.length);
          };

          setValue(fn.prototype, 'has', function (key) {
            return includes(this._keys, key);
          });

          setValue(fn.prototype, 'set', function (key, value) {
            var index = getIndex(this._keys, key);

            if (-1 < index) {
              this._values[index] = value;
            } else {
              this._keys.push(key);
              this._values.push(value);
              this.size = this._keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'clear', function () {
            this._keys.length = this._values = this.size = 0;
            return this;
          });

          setValue(fn.prototype, 'get', function (key) {
            var index = getIndex(this._keys, key);

            return -1 < index ? this._values[index] : undefined;
          });

          setValue(fn.prototype, strDelete, function (key) {
            var index = getIndex(this._keys, key);

            if (-1 < index) {
              this._keys.splice(index, 1);
              this._values.splice(index, 1);
              this.size = this._keys.length;
            }

            return this;
          });

          setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            mustBeFunction(callback);
            forEach(this._keys, function (key, index) {
              callback.call(thisArg, this._values[index], key, this);
            }, this);

            return this;
          });

          setValue(fn.prototype, 'values', function () {
            var keys = this._keys,
              values = this._values;

            function MapIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'values');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

                if (index < length) {
                  object = {
                    done: false,
                    value: values[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              });
            }

            return new MapIterator();
          });

          setValue(fn.prototype, 'keys', function () {
            var keys = this._keys;

            function MapIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'keys');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

                if (index < length) {
                  object = {
                    done: false,
                    value: keys[index]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              });
            }

            return new MapIterator();
          });

          setValue(fn.prototype, 'entries', function () {
            var keys = this._keys,
              values = this._values;

            function MapIterator() {
              var length = keys.length,
                index = 0;

              setValue(this, '@@IteratorKind', 'entries');
              setValue(this, symIt, function () {
                return this;
              });

              setValue(this, 'next', function () {
                var object;

                if (index < length) {
                  object = {
                    done: false,
                    value: [keys[index], values[index]]
                  };

                  index += 1;
                } else {
                  object = assign({}, $.DONE);
                }

                return object;
              });
            }

            return new MapIterator();
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
            next = iterator.next(),
            result = '',
            after;

          if (isUndefined(seperator)) {
            seperator = ',';
          }

          while (!next.done) {
            result += next.value;
            after = iterator.next();
            if (!after.done) {
              result += seperator;
            }

            next = after;
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

          return result;
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
      setValue(reiterate, 'Map', MapObject);
      setValue(reiterate, 'Set', SetObject);
      setValue(reiterate, 'useShims', useShims);

      return reiterate;
    }());
  }

));
