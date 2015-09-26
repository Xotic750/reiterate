/**
 * @file {@link @@HOMEPAGE @@MODULE}
 * @@DESCRIPTION
 * @version @@VERSION
 * @author @@AUTHORNAME <@@AUTHOREMAIL>
 * @copyright @@COPYRIGHT @@AUTHORNAME
 * @license {@link <@@LICLINK> @@LICENSE}
 * @module @@MODULE
 */

/*jslint maxlen:80, es6:true, this:true */

/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:29,
    maxcomplexity:7
*/

/*global
    define, module
*/

/*property
    ARRAY, ArrayGenerator, CounterGenerator, ENTRIES, EnumerateGenerator,
    FUNCTION, KEYS, MAP, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, NUMBER, OBJECT,
    OPTS, SET, STRING, STRINGTAG, StringGenerator, TYPE, UNDEFINED,
    VALUEDESCRIPTOR, VALUES, abs, addMethods, amd, asMap, asObject, asSet,
    asString, assign, bind, call, charCodeAt, chunkGenerator, clamp,
    clampToSafeIntegerRange, compactGenerator, configurable, defineProperty,
    differenceGenerator, dropGenerator, dropWhileGenerator, entries,
    enumerable, every, exports, filterGenerator, flattenGenerator, floor, from,
    getYieldValue, has, hasOwn, hasOwnProperty, isArray, isArrayLike, isFinite,
    isFunction, isLength, isNaN, isNil, isNumber, isObject, isString,
    isSurrogatePair, isUndefined, join, keys, length, mapGenerator, max, min,
    mustBeFunction, mustBeFunctionIfDefined, populatePrototypes, prototype,
    reduce, repeatGenerator, reverse, reversed, setIndexesOpts,
    setReverseIfOpt, setValue, sign, some, takeGenerator, takeWhileGenerator,
    tapGenerator, then, throwIfCircular, to, toInteger, toLength,
    toSafeInteger, toString, toStringTag, uniqueGenerator, value, valueOf,
    values, writable
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
    if (root.hasOwnProperty('@@MODULE')) {
      throw new Error('Unable to define "@@MODULE"');
    }

    Object.defineProperty(root, '@@MODULE', {
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
       * The private namespace for common values.
       * @private
       * @namespace
       */
      $ = {

        /**
         * The private namespace for pre-calculated stringtags.
         * @private
         * @namespace
         */
        STRINGTAG: {
          ARRAY: Object.prototype.toString.call(Array.prototype),
          MAP: Object.prototype.toString.call(Map.prototype),
          SET: Object.prototype.toString.call(Set.prototype),
          STRING: Object.prototype.toString.call(String.prototype),
          NUMBER: Object.prototype.toString.call(Number.prototype)
        },

        /**
         * The private namespace for pre-calculated type strings.
         * @private
         * @namespace
         */
        TYPE: {
          OBJECT: typeof Object.prototype,
          FUNCTION: typeof Function,
          UNDEFINED: typeof undefined
        },

        /**
         * The private namespace for value desciptor.
         * @private
         * @namespace
         */
        VALUEDESCRIPTOR: {
          enumerable: false,
          writable: true,
          configurable: true
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

      /**
       * The private namespace for common functions.
       * @private
       * @namespace
       */
      _ = {

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
        hasOwn: Function.call.bind(Object.prototype.hasOwnProperty),

        /**
         * Provides a string representation of the supplied object in the form
         * "[object type]", where type is the object type.
         *
         * @private
         * @param {*} subject The object for which a class string represntation
         *                    is required.
         * @return {string} A string value of the form "[object type]".
         * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.2.4.2
         */
        toStringTag: Function.call.bind(Object.prototype.toString),

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
        setValue: function (object, property, value) {
          if (_.hasOwn(object, property)) {
            throw new Error('property already exists on object');
          }

          var descriptor = _.assign({}, $.VALUEDESCRIPTOR);

          descriptor.value = value;
          return Object.defineProperty(object, property, descriptor);
        },

        /**
         * Returns true if the operand inputArg is null or undefined.
         *
         * @private
         * @param {*} subject The object to be tested.
         * @return {boolean} True if undefined or null, otherwise false.
         */
        isNil: function (subject) {
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
        toInteger: function (subject) {
          var number = +subject,
            val = 0;

          if (!Number.isNaN(number)) {
            if (!number || !Number.isFinite(number)) {
              val = number;
            } else {
              val = Math.sign(number) * Math.floor(Math.abs(number));
            }
          }

          return val;
        },

        /**
         * Returns true if the operand inputArg is a Number.
         *
         * @private
         * @param {*} subject The object to be to tested.
         * @return {boolean} True if is a number, otherwise false.
         */
        isNumber: function (subject) {
          return _.toStringTag(subject) === $.STRINGTAG.NUMBER;
        },

        /**
         * Returns a number clamped to the range set by min and max.
         *
         * @private
         * @param {numer} number The value to clamp if necessary.
         * @param {number} min The minimum value allowed.
         * @param {number} max The maximum value allowed
         * @return {number} The clammped value.
         */
        clamp: function (number, min, max) {
          return Math.min(Math.max(number, min), max);
        },

        /**
         * The function evaluates the passed value and converts it to a safe
         * integer.
         *
         * @private
         * @param {*} subject
         * @return {number}
         */
        toSafeInteger: function (subject) {
          return _.clamp(
            _.toInteger(subject),
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER
          );
        },

        /**
         * Returns true if the operand subject is undefined
         *
         * @private
         * @param {*} subject The object to be tested.
         * @return {boolean} True if the object is undefined, otherwise false.
         */
        isUndefined: function (subject) {
          return typeof subject === $.TYPE.UNDEFINED;
        },

        /**
         * Returns true if the operand subject is a Function
         *
         * @private
         * @param {*} subject The object to be tested.
         * @return {boolean} True if the object is a function, otherwise false.
         */
        isFunction: function (subject) {
          return typeof subject === $.TYPE.FUNCTION;
        },

        /**
         * Returns true if the operand inputArg is a String.
         *
         * @private
         * @param {*} subject
         * @return {boolean}
         */
        isString: function (subject) {
          return _.toStringTag(subject) === $.STRINGTAG.STRING;
        },

        /**
         * Checks if value is a valid array-like length.
         *
         * @private
         * @param {*} subject The value to check.
         * @return {boolean} Returns true if value is a valid length,
         *                   else false.
         */
        isLength: function (subject) {
          return _.toSafeInteger(subject) === subject && subject >= 0;
        },

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
        isArrayLike: function (subject) {
          return !_.isNil(subject) &&
            !_.isFunction(subject) &&
            _.isLength(subject.length);
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
        isArray: function (subject, relaxed) {
          var isA;

          if (relaxed) {
            isA = _.isArrayLike(subject) && !_.isString(subject);
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
        isSurrogatePair: function (char1, char2) {
          var result = false,
            code1,
            code2;

          if (char1 && char2 && _.isString(char1) && _.isString(char2)) {
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
        mustBeFunction: function (subject) {
          if (!_.isFunction(subject)) {
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
        mustBeFunctionIfDefined: function (subject, name) {
          if (!_.isUndefined(subject) && !_.isFunction(subject)) {
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
        clampToSafeIntegerRange: function (subject) {
          var num = +subject,
            v = 0;

          if (!Number.isNaN(num)) {
            v = _.clamp(num, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
          }

          return v;
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
        toLength: function (subject) {
          return _.clamp(_.toInteger(subject), 0, Number.MAX_SAFE_INTEGER);
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
        isObject: function (subject) {
          var type = typeof subject;

          return !!subject &&
            (type === $.TYPE.OBJECT || type === $.TYPE.FUNCTION);
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
        throwIfCircular: function (stack, value) {
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
        setReverseIfOpt: function (opts, generator) {
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
        assign: (function () {
          /**
           * Iterate source own keys and assign then to the target.
           *
           * @private
           * @param {object} from The source object.
           * @param {object} to The target object.
           */
          function assignFromSource(from, to) {
            var keys = Object.keys(from),
              len = keys.length,
              index = 0,
              key;

            while (index < len) {
              key = keys[index];
              if (_.hasOwn(from, key)) {
                to[key] = from[key];
              }

              index += 1;
            }
          }

          /**
           * The assign function.
           */
          return function (target) {
            var length = arguments.length,
              index,
              arg;

            if (length >= 2) {
              index = 1;
              while (index < length) {
                arg = arguments[index];
                if (!_.isNil(arg)) {
                  assignFromSource(arg, target);
                }

                index += 1;
              }
            }

            return target;
          };
        }()),

        /**
         * A function to return the entries, values or keys depending on the
         * generator options.
         *
         * @private
         * @param {object} opts The generator options object.
         * @param {object} object The object being iterated/enumerated.
         * @param {object} object The key to get the value from the object.
         */
        getYieldValue: function (opts, object, key) {
          var result,
            value;

          if (opts.keys) {
            result = key;
          } else {
            value = object[key];
            if (opts.values) {
              result = value;
            } else {
              result = [key, value];
            }
          }

          return result;
        },

        addMethods: function (object) {
          if (object !== g.repeatGenerator.prototype) {
            _.setValue(object, 'filter', p.filterGenerator);
            _.setValue(object, 'map', p.mapGenerator);
            _.setValue(object, 'every', p.every);
            _.setValue(object, 'some', p.some);
            _.setValue(object, 'drop', p.dropGenerator);
            _.setValue(object, 'dropWhile', p.dropWhileGenerator);
            _.setValue(object, 'difference', p.differenceGenerator);
          }

          _.setValue(object, 'take', p.takeGenerator);
          _.setValue(object, 'takeWhile', p.takeWhileGenerator);
          _.setValue(object, 'reduce', p.reduce);
          _.setValue(object, 'tap', p.tapGenerator);
          _.setValue(object, 'join', p.join);
          _.setValue(object, 'then', p.then);
          _.setValue(object, 'chunk', p.chunkGenerator);
          _.setValue(object, 'valueOf', p.valueOf);
          _.setValue(object, 'toString', p.toString);
          _.setValue(object, 'asString', p.asString);
          _.setValue(object, 'asObject', p.asObject);
          _.setValue(object, 'asMap', p.asMap);
          _.setValue(object, 'initial', p.initialGenerator);
          if (object !== g.CounterGenerator.prototype) {
            _.setValue(object, 'enumerate', g.EnumerateGenerator);
            _.setValue(object, 'unique', p.uniqueGenerator);
            _.setValue(object, 'flatten', p.flattenGenerator);
          }

          if (object !== g.repeatGenerator.prototype &&
            object !== g.CounterGenerator.prototype) {

            _.setValue(object, 'compact', p.compactGenerator);
          }

          if (object === p.uniqueGenerator.prototype) {
            _.setValue(object, 'asSet', p.asSet);
          }
        },

        populatePrototypes: function () {
          _.addMethods(g.CounterGenerator.prototype);
          _.addMethods(g.ArrayGenerator.prototype);
          _.addMethods(g.StringGenerator.prototype);
          _.addMethods(g.EnumerateGenerator.prototype);
          _.addMethods(g.repeatGenerator.prototype);
          _.addMethods(p.mapGenerator.prototype);
          _.addMethods(p.filterGenerator.prototype);
          _.addMethods(p.uniqueGenerator.prototype);
          _.addMethods(p.flattenGenerator.prototype);
          _.addMethods(p.dropGenerator.prototype);
          _.addMethods(p.dropWhileGenerator.prototype);
          _.addMethods(p.takeGenerator.prototype);
          _.addMethods(p.takeWhileGenerator.prototype);
          _.addMethods(p.tapGenerator.prototype);
          _.addMethods(p.chunkGenerator.prototype);
          _.addMethods(p.compactGenerator.prototype);
          _.addMethods(p.differenceGenerator.prototype);
          _.addMethods(p.initialGenerator.prototype);
        },

        setIndexesOpts: function (start, end, opts) {
          opts.from = _.toInteger(start);
          if (opts.from < 0) {
            opts.from = Math.max(opts.length + opts.from, 0);
          } else {
            opts.from = Math.min(opts.from, opts.length);
          }

          if (_.isUndefined(end)) {
            opts.to = opts.length;
          } else {
            opts.to = _.toInteger(end);
          }

          if (opts.to < 0) {
            opts.to = Math.max(opts.length + opts.to, 0);
          } else {
            opts.to = Math.min(opts.to, opts.length);
          }

          opts.to = _.toLength(opts.to) - 1;
        }

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

          _.mustBeFunction(callback);
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

          _.mustBeFunction(callback);
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

          _.mustBeFunction(callback);
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

          _.mustBeFunction(callback);
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
          var result = '',
            iterator = this[Symbol.iterator](),
            item = iterator.next(),
            next;

          if (_.isUndefined(seperator)) {
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

          return _.setValue(result, 'length', index);
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
            length = _.toLength(number),
            item;

          for (item of this) {
            if (index >= length) {
              yield item;
            }

            index += 1;
          }
        },

        dropWhileGenerator: function* (callback, thisArg) {
          var index,
            item,
            drop;

          _.mustBeFunction(callback);
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
          var length = _.toLength(number),
            index,
            item;

          if (!length) {
            return;
          }

          index = 0;
          for (item of this) {
            if (index < length) {
              yield item;
            } else {
              break;
            }

            index += 1;
          }
        },

        takeWhileGenerator: function* (callback, thisArg) {
          var index,
            item,
            take;

          _.mustBeFunction(callback);
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
          var length = _.toLength(size) || 1,
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

          if (chunk) {
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
          var vals = new Set(),
            item;

          for (item of new Reiterate(values).values()) {
            vals.add(item);
          }

          for (item of this) {
            if (!vals.has(item)) {
              yield item;
            }
          }

          vals.clear();
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

        uniqueGenerator: function* () {
          var seen = new Set(),
            item;

          for (item of this) {
            if (!seen.has(item)) {
              yield item;
              seen.add(item);
            }
          }

          seen.clear();
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
                if (_.isArray(value, relaxed)) {
                  _.throwIfCircular(stack, value);
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
              if (_.isArray(object, relaxed)) {
                setStack(stack, object, null);
              } else {
                yield object;
              }

              yield * iterateStack(stack, object, relaxed);
            }

            stack.clear();
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
              if (_.isObject(object)) {
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
                  if (_.isObject(value)) {
                    _.throwIfCircular(stack, value);
                    setStack(stack, value, object);
                    object = value;
                  } else {
                    yield value;
                  }

                  tail.index += 1;
                }
              }
            }

            stack.clear();
          };
        }()),
        */

        mapGenerator: function* (callback, thisArg) {
          _.mustBeFunction(callback);
          for (var element of this) {
            yield callback.call(thisArg, element, this);
          }
        },

        filterGenerator: function* (callback, thisArg) {
          _.mustBeFunction(callback);
          for (var element of this) {
            if (callback.call(thisArg, element, this)) {
              yield element;
            }
          }
        },

        then: function (generator) {
          var iterator;

          if (!_.isFunction(generator)) {
            _.mustBeFunctionIfDefined(generator, 'generator');
            iterator = this;
          } else {
            iterator = generator(this);
            _.addMethods(iterator);
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

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, Symbol.iterator, function () {
              return countGenerator(_.assign({}, opts));
            });

            _.setValue(this, 'from', function (number) {
              opts.from = _.clampToSafeIntegerRange(number);
              return this;
            });

            _.setValue(this, 'to', function (number) {
              opts.to = _.clampToSafeIntegerRange(number);
              return this;
            });

            _.setValue(this, 'by', function (number) {
              opts.by = Math.abs(_.clampToSafeIntegerRange(number));
              if (!opts.by) {
                throw new TypeError('can not count by zero');
              }

              return this;
            });

            _.setValue(this, 'reverse', function () {
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

            if (!opts.length) {
              return;
            }

            generator = g.CounterGenerator();
            generator.from(opts.from).to(opts.to).by(opts.by);
            _.setReverseIfOpt(opts, generator);
            for (key of generator) {
              yield _.getYieldValue(opts, subject, key);
            }
          }

          function ArrayGenerator(subject) {
            if (!(this instanceof ArrayGenerator)) {
              return new ArrayGenerator(subject);
            }

            var length = _.isArrayLike(subject) ? subject.length : 0,
              opts = _.assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.ENTRIES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, Symbol.iterator, function () {
              return arrayGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);
              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);
              return this;
            });

            _.setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            _.setValue(this, 'slice', function (start, end) {
              _.setIndexesOpts(start, end, opts);
              return this;
            });
          }

          return ArrayGenerator;
        }()),

        StringGenerator: (function () {
          function getStringYieldValue(opts, character, key) {
            var value,
              result;

            if (opts.keys) {
              result = key;
            } else {
              value = String.fromCodePoint(character.codePointAt());
              if (opts.values) {
                result = value;
              } else {
                result = [key, value];
              }
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
            _.setReverseIfOpt(opts, generator);
            for (key of generator) {
              if (next) {
                if (opts.reversed) {
                  char1 = subject[key - 1];
                  char2 = subject[key];
                  next = !_.isSurrogatePair(char1, char2);
                  if (next) {
                    yield getStringYieldValue(opts, char2, key);
                  }
                } else {
                  char1 = subject[key];
                  char2 = subject[key + 1];
                  next = !_.isSurrogatePair(char1, char2);
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

            var length = _.isArrayLike(subject) ? subject.length : 0,
              opts = _.assign({
                length: length,
                reversed: false,
                from: 0,
                to: length - 1,
                by: 1
              }, $.OPTS.ENTRIES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, Symbol.iterator, function () {
              return stringGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);
              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);
              return this;
            });

            _.setValue(this, 'reverse', function () {
              opts.reversed = !opts.reversed;
              return this;
            });

            _.setValue(this, 'slice', function (start, end) {
              var char1,
                char2;

              _.setIndexesOpts(start, end, opts);
              if (opts.from) {
                char1 = subject[opts.from - 1];
                char2 = subject[opts.from];
                if (_.isSurrogatePair(char1, char2)) {
                  opts.from += 1;
                }
              }

              if (opts.to) {
                char1 = subject[opts.to - 1];
                char2 = subject[opts.to];
                if (_.isSurrogatePair(char1, char2)) {
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
              if (!opts.own || _.hasOwn(subject, key)) {
                yield _.getYieldValue(opts, subject, key);
              }
            }
          }

          function EnumerateGenerator(subject) {
            if (!(this instanceof EnumerateGenerator)) {
              return new EnumerateGenerator(subject);
            }

            var opts = _.assign({
              own: false
            }, $.OPTS.ENTRIES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, Symbol.iterator, function () {
              return enumerateGenerator(subject, _.assign({}, opts));
            });

            _.setValue(this, 'entries', function () {
              _.assign(opts, $.OPTS.ENTRIES);
              return this;
            });

            _.setValue(this, 'values', function () {
              _.assign(opts, $.OPTS.VALUES);
              return this;
            });

            _.setValue(this, 'keys', function () {
              _.assign(opts, $.OPTS.KEYS);
              return this;
            });

            _.setValue(this, 'own', function () {
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

    _.populatePrototypes();

    return (function () {
      function makeCounterGenerator(subject, to, by) {
        var generator = g.CounterGenerator();

        if (_.isNumber(subject)) {
          if (_.isNil(to)) {
            generator.to(subject);
          } else {
            generator.from(subject).to(to);
          }

          if (!_.isNil(by)) {
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

        if (_.isNil(subject) || _.isNumber(subject)) {
          generator = makeCounterGenerator(subject, to, by);
        } else if (_.isArray(subject, to)) {
          generator = g.ArrayGenerator(subject);
        } else if (_.isString(subject)) {
          generator = g.StringGenerator(subject);
        } else if (_.isObject(Symbol) &&
          _.isFunction(subject[Symbol.iterator])) {

          generator = subject[Symbol.iterator]();
          _.addMethods(generator);
        } else {
          generator = g.EnumerateGenerator(subject);
        }

        return generator;
      };

      /*
       * Static methods
       */
      _.setValue(Reiterate, 'array', g.ArrayGenerator);
      _.setValue(Reiterate, 'string', g.StringGenerator);
      _.setValue(Reiterate, 'enumerate', g.EnumerateGenerator);
      _.setValue(Reiterate, 'repeat', g.repeatGenerator);

      return Reiterate;
    }());
  }

));
