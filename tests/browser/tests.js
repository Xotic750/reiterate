(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * @file {@link http://xotic750.github.io/reiterate/ reiterate}
 * A modern iteration library.
 * @version 0.1.0
 * @author Xotic750 <Xotic750@gmail.com>
 * @copyright  Xotic750
 * @license {@link <http://www.gnu.org/licenses/gpl-3.0.html> GPL-3.0+}
 * @module reiterate
 */

/*jslint maxlen:80, es6:false, this:true, bitwise:true, white:true, for:true */

/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    es3:true, esnext:true, plusplus:true, maxparams:4, maxdepth:6,
    maxstatements:false, maxcomplexity:false
*/

/*global
    window, self, global, define, module, Map, Set, Symbol
*/

/*property
    $, ArrayGenerator, CounterGenerator, DONE, ENTRIES, EnumerateGenerator,
    IdGenerator, KEYS, MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, OPTS,
    RepeatGenerator, StringGenerator, ThenGenerator, UnzipGenerator, VALUES,
    abs, add, amd, apply, asArray, asMap, asObject, asSet, asString,
    assertIsFunction, assertIsObject, assign, by, call, charCodeAt, chop,
    chunkGenerator, clampToSafeIntegerRange, clear, codePointAt,
    compactGenerator, concat, configurable, curry, defineProperty,
    differenceGenerator, done, drop, dropGenerator, dropWhileGenerator,
    entries, enumerable, every, exports, filter, filterGenerator, findIndex,
    first, flattenGenerator, floor, forEach, from, fromCharCode, fromCodePoint,
    get, getIndex, getPrototypeOf, has, hasApplyBug, hasBoxedStringBug,
    hasCallBug, hasEnumArgsBug, hasOwn, hasOwnProperty, hasProperty,
    hasV8Strictbug, id, inStrictMode, includes, index, indexOf,
    initialGenerator, intersectionGenerator, is, isArray, isArrayLike, isDate,
    isFinite, isFunction, isIndex, isInteger, isLength, isNaN, isNil, isNumber,
    isObject, isObjectLike, isString, isSurrogatePair, isSymbol, isUndefined,
    iterator, join, keys, last, length, map, mapGenerator, max, min, next,
    noop, numIsFinite, numIsNaN, order, own, pow, prev, prototype, push,
    reduce, reflectArg, requireObjectCoercible, reset, rest, restGenerator,
    returnArgs, returnThis, reverse, reversed, sameValueZero, set, setValue,
    sign, size, some, splice, symIt, takeGenerator, takeWhileGenerator,
    tapGenerator, then, to, toInteger, toLength, toNumber, toObject,
    toPrimitive, toString, toStringTag, unionGenerator, uniqueGenerator,
    useShims, value, values, writable, zipGenerator
*/

/**
 * UMD (Universal Module Definition)
 *
 * @private
 * @see https://github.com/umdjs/umd/blob/master/returnExports.js
 */
(function umd(thisArg, factory) {
  'use strict';

  var root,
    $hasOwnProperty = Object.prototype.hasOwnProperty,
    $defineProperty = Object.defineProperty,
    $push = Array.prototype.push,
    $forEach = Array.prototype.forEach,
    $reduce = Array.prototype.reduce,
    $filter = Array.prototype.filter,
    $map = Array.prototype.map,
    $some = Array.prototype.some,
    $every = Array.prototype.every,
    $indexOf = Array.prototype.indexOf,
    $findIndex = Array.prototype.findIndex,
    $includes = Array.prototype.includes,
    $codePointAt = String.prototype.codePointAt,
    reduceError = 'reduce of empty array with no initial value',
    strFor = 'for',
    typeUndefined,
    typeFunction = typeof factory,
    typeObject = typeof Object.prototype,
    typeNumber = typeof 0,
    typeBoolean = typeof false,
    typeString = typeof strFor,
    typeSymbol,
    toTag = Object.prototype.toString,
    stringOrder = ['toString', 'valueOf'],
    numberOrder = stringOrder.slice().reverse(),
    descriptor = {
      enumerable: false,
      writable: true,
      configurable: true
    },
    _ = {
      useShims: false,
      MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1,
      MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1)
    },
    tagFunction,
    tagDate,
    tagNumber,
    tagString,
    tagArray,
    arrayIsArray,
    fixCall,
    testProp;

  /**
   * @private
   * @return {undefined}
   */
  _.noop = function noop() {
    return;
  };

  typeUndefined = typeof _.noop();

  /**
   * Returns the this context of the function.
   *
   * @private
   * @return {*}
   */
  function returnThis() {
    /*jshint validthis:true */
    return this;
  }

  _.returnThis = returnThis;

  /**
   * Indicates if running in strict mode.
   * True if we are, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.inStrictMode = !returnThis();

  /**
   * Indicates if the this argument used with call does not convert to an
   * object when not strict mode. True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasCallBug = !_.inStrictMode &&
    typeof returnThis.call(strFor) === typeString;

  /**
   * Indicates if the this argument used with apply does not convert to an
   * object when not strict mode. True if it does not, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasApplyBug = !_.inStrictMode &&
    typeof returnThis.apply(strFor) === typeString;

  /**
   * Checks if the environment suffers the V8 strict mode bug.
   *
   * @private
   * @type {boolean}
   */
  if (_.inStrictMode && $forEach) {
    $forEach.call([1], function () {
      _.hasV8Strictbug = typeof this === typeObject;
    }, strFor);
  } else {
    _.hasV8Strictbug = false;
  }

  /**
   * Indicates if a string suffers the "indexed accessability bug".
   * True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasBoxedStringBug = Object(strFor)[0] !== 'f' ||
    !(0 in Object(strFor));

  /**
   * Returns an arguments object of the arguments supplied.
   *
   * @private
   * @param {...*} [varArgs]
   * @return {Arguments}
   */
  _.returnArgs = function returnArgs() {
    return arguments;
  };

  /**
   * Indicates if the arguments object suffers the "index enumeration bug".
   * True if it does, otherwise false.
   *
   * @private
   * @type {boolean}
   */
  _.hasEnumArgsBug = true;
  for (testProp in _.returnArgs(strFor)) {
    if (testProp === '0') {
      _.hasEnumArgsBug = false;
      break;
    }
  }

  /**
   * Returns true if the operand subject is undefined
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is undefined, otherwise false.
   */
  _.isUndefined = function isUndefined(subject) {
    return typeof subject === typeUndefined;
  };

  /**
   * Returns true if the operand inputArg is null.
   *
   * @private
   * @param {*} inputArg
   * @return {boolean}
   */
  _.isNull = function isNull(inputArg) {
    return inputArg === null;
  };

  /**
   * Returns true if the operand subject is null or undefined.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if undefined or null, otherwise false.
   */
  _.isNil = function isNil(subject) {
    return _.isNull(subject) || _.isUndefined(subject);
  };

  /**
   * Checks if value is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, new Number(0),
   * and new String('')).
   *
   * @private
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is an object, else false.
   */
  _.isObject = function isObject(subject) {
    var type;

    if (!subject) {
      type = false;
    } else {
      type = typeof subject;
      type = type === typeObject || type === typeFunction;
    }

    return type;
  };

  if ($defineProperty && !_.useShims) {
    // IE 8 only supports 'Object.defineProperty' on DOM elements
    try {
      $defineProperty({}, {}, {});
    } catch (e) {
      /* istanbul ignore next */
      $defineProperty = !e;
    }
  }

  /* istanbul ignore next */
  if (!$defineProperty || _.useShims) {
    $defineProperty = function defineProperty(object, property, descriptor) {
      if (!_.isObject(object)) {
        throw new TypeError('called on non-object');
      }

      object[property] = descriptor.value;

      return object;
    };
  }

  _.defineProperty = $defineProperty;

  /**
   * The abstract operation throws an error if its argument is a value that
   * cannot be converted to an Object, otherwise returns the argument.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @throws {TypeError} If subject is null or undefined.
   * @return {*} The subject if coercible.
   */
  _.requireObjectCoercible = function requireObjectCoercible(subject) {
    /* istanbul ignore if */
    if (_.isNil(subject)) {
      throw new TypeError('Cannot convert argument to object');
    }

    return subject;
  };

  /**
   * The abstract operation converts its argument to a value of type Object.
   *
   * @private
   * @param {*} subject The argument to be converted to an object.
   * @throws {TypeError} If subject is not coercible to an object.
   * @return {Object} Value of subject as type Object.
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-9.9
   */
  _.toObject = function toObject(subject) {
    return _.isObject(_.requireObjectCoercible(subject)) ?
      subject :
      Object(subject);
  };

  _.reflectArg = function reflectArg(subject) {
    return subject;
  };

  if (_.inStrictMode && _.hasCallBug) {
    fixCall = function fixCallApply(subject) {
      return !_.isNil(subject) ? _.toObject(subject) : subject;
    };
  } else {
    fixCall = _.reflectArg;
  }

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
  _.hasOwn = function hasOwn(subject, property) {
    /*jshint singleGroups:false */
    return (_.hasBoxedStringBug &&
        _.isString(subject) &&
        _.isIndex(property, subject.length)) ||

      $hasOwnProperty.call(
        _.toObject(subject),
        _.isSymbol(property) ? property : _.toString(property)
      ) ||

      /*
       * Avoid a bug in IE 10-11 where objects with a [[Prototype]] of 'null',
       * that are composed entirely of index properties, return 'false' for
       * 'hasOwnProperty' checks of them.
       */
      (Object.getPrototypeOf &&
        typeof subject === typeObject &&
        _.hasProperty(subject, property) &&
        _.isNull(Object.getPrototypeOf(subject)));
  };

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
  _.setValue = function setValue(object, property, value, noCheck) {
    /* istanbul ignore if */
    if (!noCheck && _.hasOwn(object, property)) {
      throw new Error(
        'property "' + property + '" already exists on object'
      );
    }

    descriptor.value = value;
    $defineProperty(object, property, descriptor);
    delete descriptor.value;

    return object;
  };

  _.symIt = typeof Symbol === typeFunction ? Symbol.iterator : '@@iterator';

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
  _.toStringTag = function toStringTag(subject) {
    var val;

    if (_.isNull(subject)) {
      val = '[object Null]';
    } else if (_.isUndefined(subject)) {
      val = '[object Undefined]';
    } else {
      val = toTag.call(subject);
    }

    return val;
  };

  tagFunction = _.toStringTag(_.isNil);

  /**
   * Returns true if the operand subject is a Function
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a function, otherwise false.
   */
  _.isFunction = function isFunction(subject) {
    var tag = _.toStringTag(subject),
      result = false;

    if (_.isObject(subject)) {
      tag = _.toStringTag(subject);
      /* istanbul ignore else */
      if (tag === tagFunction) {
        result = true;
      } else if (tag === '[object GeneratorFunction]') {
        result = typeof subject === typeFunction;
      }
    }

    return result;
  };

  /**
   * Checks if value is object-like. A value is object-like if it's not null
   * and has a typeof result of "object".
   *
   * @privaye
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is object-like, else false.
   */
  _.isObjectLike = function isObjectLike(subject) {
    return !!subject && typeof subject === typeObject;
  };

  tagDate = _.toStringTag(new Date());

  /* istanbul ignore next */
  _.isDate = function isDate(value) {
    return _.isObjectLike(value) && _.toStringTag(value) === tagDate;
  };

  /* istanbul ignore next */
  _.toPrimitive = function toPrimitive(subject, hint) {
    var methodNames,
      method,
      index,
      result;

    if (!_.isObject(subject)) {
      result = subject;
    } else {
      /*jshint singleGroups:false */
      if (hint === typeString || (hint !== typeNumber && _.isDate(subject))) {
        methodNames = stringOrder;
      } else {
        methodNames = numberOrder;
      }

      index = 0;
      while (index < 2) {
        method = methodNames[index];
        if (_.isFunction(subject[method])) {
          result = subject[method]();
          if (!_.isObject(result)) {
            return result;
          }
        }

        index += 1;
      }

      /* istanbul ignore next */
      throw new TypeError('ordinaryToPrimitive returned an object');
    }

    return result;
  };

  if (typeof Symbol === typeFunction && Symbol[strFor]) {
    typeSymbol = typeof Symbol[strFor](strFor);
  }

  _.toNumber = function toNumber(subject) {
    var type,
      val;

    /* istanbul ignore if */
    if (_.isNull(subject)) {
      val = +0;
    } else {
      type = typeof subject;
      if (type === typeNumber) {
        val = subject;
      } else if (type === typeUndefined) {
        val = NaN;
      } else {
        /* istanbul ignore next */
        if (type === typeBoolean) {
          val = subject ? 1 : +0;
        } else if (type === typeString) {
          val = Number(subject);
        } else {
          if (typeSymbol && type === typeSymbol) {
            throw new TypeError('Can not convert symbol to a number');
          }

          val = _.toNumber(_.toPrimitive(subject, typeNumber));
        }
      }
    }

    return val;
  };

  /* istanbul ignore else */
  if (Math.sign && !_.useShims) {
    _.sign = Math.sign;
  } else {
    _.sign = function sign(value) {
      return _.toNumber(value) && (_.toNumber(value >= 0) || -1);
    };
  }

  /* istanbul ignore else */
  if (Number.isNaN && !_.useShims) {
    _.numIsNaN = Number.isNaN;
  } else {
    _.numIsNaN = function numIsNaN(subject) {
      return typeof subject === typeNumber && isNaN(subject);
    };
  }

  /* istanbul ignore else */
  if (Number.isFinite && !_.useShims) {
    _.numIsFinite = Number.isFinite;
  } else {
    _.numIsFinite = function (subject) {
      return typeof subject === typeNumber && isFinite(subject);
    };
  }

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
  _.toInteger = function toInteger(subject) {
    var number = _.toNumber(subject);

    if (_.numIsNaN(number)) {
      number = 0;
    } else if (number && _.numIsFinite(number)) {
      number = _.sign(number) * Math.floor(Math.abs(number));
    }

    return number;
  };

  tagNumber = _.toStringTag(0);

  /**
   * Returns true if the operand subject is a Number.
   *
   * @private
   * @param {*} subject The object to be to tested.
   * @return {boolean} True if is a number, otherwise false.
   */
  _.isNumber = function isNumber(subject) {
    var type = typeof subject;

    /*jshint singleGroups:false */
    return type === typeNumber ||
      (type === typeObject && _.toStringTag(subject) === tagNumber);
  };

  tagString = _.toStringTag(strFor);

  /**
   * Returns true if the operand subject is a String.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  _.isString = function isString(subject) {
    var type = typeof subject;

    /*jshint singleGroups:false */
    return type === typeString ||
      (type === typeObject && _.toStringTag(subject) === tagString);
  };

  /**
   * Checks if value is a valid array-like length.
   *
   * @private
   * @param {*} subject The value to check.
   * @return {boolean} Returns true if value is a valid length,
   *                   else false.
   */
  _.isLength = function isLength(subject) {
    return typeof subject === typeNumber &&
      subject > -1 &&
      subject % 1 === 0 &&
      subject <= _.MAX_SAFE_INTEGER;
  };

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
  _.isArrayLike = function isArrayLike(subject) {
    return !_.isNil(subject) &&
      !_.isFunction(subject) &&
      _.isLength(subject.length);
  };

  tagArray = _.toStringTag([]);

  /* istanbul ignore else */
  if (Array.isArray && !_.useShims) {
    arrayIsArray = Array.isArray;
  } else if (tagArray === '[object Array]') {
    arrayIsArray = function arrayIsArray(subject) {
      return _.isArrayLike(subject) && _.toStringTag(subject) === tagArray;
    };
  } else {
    // fallback
    arrayIsArray = function arrayIsArray(subject) {
      return _.isArrayLike(subject) &&
        !_.isString(subject) &&
        _.hasOwn(subject, 'length') &&
        !_.hasOwn(subject, 'callee');
    };
  }

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
  _.isArray = function isArray(subject, relaxed) {
    var isA;

    if (relaxed) {
      isA = _.isArrayLike(subject) && !_.isString(subject);
    } else {
      isA = arrayIsArray(subject);
    }

    return isA;
  };

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
  _.isSurrogatePair = function isSurrogatePair(char1, char2) {
    var result = false,
      code1,
      code2;

    if (_.isString(char1) && _.isString(char2)) {
      code1 = char1.charCodeAt();
      if (code1 >= 0xD800 && code1 <= 0xDBFF) {
        code2 = char2.charCodeAt();
        if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
          result = true;
        }
      }
    }

    return result;
  };

  /* istanbul ignore else */
  if ($codePointAt && !_.useShims) {
    _.codePointAt = function codePointAt(string, position) {
      return $codePointAt.call(string, position);
    };
  } else {
    _.codePointAt = function codePointAt(subject, position) {
      var string = String(_.requireObjectCoercible(subject)),
        size = string.length,
        index = _.toInteger(position),
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

  /**
   * Tests the subject to see if it is a function and throws an error if
   * it is not.
   *
   * @private
   * @param {*} subject The argument to test for validity.
   * @throws {TypeError} If subject is not a function
   * @return {*} Returns the subject if passes.
   */
  _.assertIsFunction = function assertIsFunction(subject) {
    if (!_.isFunction(subject)) {
      throw new TypeError('argument must be a function');
    }

    return subject;
  };

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
  _.toLength = function toLength(subject) {
    var length = _.toInteger(subject);

    /* istanbul ignore else */
    if (length <= 0) {
      length = 0;
    } else if (length > _.MAX_SAFE_INTEGER) {
      length = _.MAX_SAFE_INTEGER;
    }

    return length;
  };

  /**
   * Checks if 'value' is a valid array-like index.
   *
   * @private
   * @param {*} inputArg The value to check.
   * @param {number} [length] The upper bounds of a valid index otherwise
   *                          MAX_SAFE_INTEGER - 1.
   * @return {boolean} Returns true if inputArg is a valid index, otherwise
   *                   false.
   */
  _.isIndex = function isIndex(inputArg, length) {
    var size,
      arg;

    if (arguments.length > 1) {
      size = _.toLength(length);
    } else {
      size = _.MAX_SAFE_INTEGER - 1;
    }

    arg = _.toNumber(inputArg);

    return _.isLength(arg) && arg < size;
  };

  /**
   * This method adds one or more elements to the end of the array and
   * returns the new length of the array.
   *
   * @param {array} array
   * @param {...*} [varArgs]
   * @return {number}
   */
  testProp = [];
  if (!_.useShims || $push.call(testProp, _.noop()) !== 1 ||
    testProp.length !== 1 || testProp[0] !== _.noop()) {
    _.push = function push(array) {
      return $push.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.push = function push(array) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        numItems = arguments.length - 1,
        index = 0;

      object.length = length + numItems;
      while (index < numItems) {
        object[length + index] = arguments[index + 1];
        index += 1;
      }

      return object.length;
    };
  }
  /**
   * The abstract operation converts its argument to a value of type string
   *
   * @private
   * @param {*} inputArg
   * @return {string}
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tostring
   */
  _.toString = function toStrIng(inputArg) {
    var type,
      val;

    if (_.isNull(inputArg)) {
      val = 'null';
    } else {
      type = typeof inputArg;
      if (type === typeString) {
        val = inputArg;
      } else if (type === typeUndefined) {
        val = type;
      } else {
        if (typeSymbol && type === typeSymbol) {
          throw new TypeError('Cannot convert symbol to string');
        }

        val = String(inputArg);
      }
    }

    return val;
  };

  _.isSymbol = function isSymbol(subject) {
    return typeSymbol && typeof subject === typeSymbol;
  };

  /**
   * @private
   * @param {*} inputArg The object to be tested.
   * @param {string} property The property name.
   * @return {boolean} True if the property is on the object or in the object's
   *                   prototype, otherwise false.
   */
  _.hasProperty = function hasProperty(inputArg, property) {
    var prop = _.isSymbol(property) ? property : _.toString(property);

    /*jshint singleGroups:false */
    return (_.isString(inputArg) && _.isIndex(prop, inputArg.length)) ||
      prop in _.toObject(inputArg);
  };

  _.chop = function chop(array, start, end) {
    var object = _.toObject(array),
      length = _.toLength(object.length),
      relativeStart = _.toInteger(start),
      val = [],
      next = 0,
      relativeEnd,
      finalEnd,
      k;

    /* istanbul ignore if */
    if (relativeStart < 0) {
      k = Math.max(length + relativeStart, 0);
    } else {
      k = Math.min(relativeStart, length);
    }

    /* istanbul ignore else */
    if (_.isUndefined(end)) {
      relativeEnd = length;
    } else {
      relativeEnd = _.toInteger(end);
    }

    /* istanbul ignore if */
    if (relativeEnd < 0) {
      finalEnd = Math.max(length + relativeEnd, 0);
    } else {
      finalEnd = Math.min(relativeEnd, length);
    }

    finalEnd = _.toLength(finalEnd);
    val.length = _.toLength(Math.max(finalEnd - k, 0));
    while (k < finalEnd) {
      if (_.hasProperty(object, k)) {
        val[next] = object[k];
      }

      next += 1;
      k += 1;
    }

    return val;
  };

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
  /* istanbul ignore else */
  if ($reduce && !_.hasV8Strictbug && !_.useShims) {
    _.reduce = function reduce(array) {
      return $reduce.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.reduce = function reduce(array, callback, initialValue) {
      var object = _.toObject(array),
        acc,
        length,
        kPresent,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      if (!length && arguments.length === 2) {
        throw new TypeError(reduceError);
      }

      index = 0;
      if (arguments.length > 2) {
        acc = initialValue;
      } else {
        kPresent = false;
        while (!kPresent && index < length) {
          kPresent = _.hasProperty(object, index);
          if (kPresent) {
            acc = object[index];
            index += 1;
          }
        }

        if (!kPresent) {
          throw new TypeError(reduceError);
        }
      }

      while (index < length) {
        if (_.hasProperty(object, index)) {
          acc = callback.call(
            fixCall(_.noop()),
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

  /**
   * The isInteger method determines whether the passed value is an integer.
   * If the target value is an integer, return true, otherwise return false.
   * If the value is NaN or infinite, return false.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  _.isInteger = function isInteger(subject) {
    /* istanbul ignore next */
    return _.numIsFinite(subject) && _.toInteger(subject) === subject;
  };

  /* istanbul ignore else */
  if (String.fromCodePoint && !_.useShims) {
    _.fromCodePoint = String.fromCodePoint;
  } else {
    _.fromCodePoint = function fromCodePoint() {
      var MAX_SIZE = 0x4000,
        codeUnits = [];

      return _.reduce(arguments, function (result, arg) {
        var codePnt = _.toNumber(arg),
          highSurrogate,
          lowSurrogate;

        if (!_.isInteger(codePnt) || codePnt < 0 || codePnt > 0x10FFFF) {
          throw new RangeError('Invalid codePnt point: ' + codePnt);
        }

        if (codePnt <= 0xFFFF) {
          _.push(codeUnits, codePnt);
        } else {
          codePnt -= 0x10000;
          /*jshint singleGroups:false */
          /*jshint bitwise:false */
          highSurrogate = (codePnt >> 10) + 0xD800;
          /*jshint bitwise:true */
          lowSurrogate = (codePnt % 0x400) + 0xDC00;
          /*jshint singleGroups:true */
          _.push(codeUnits, highSurrogate, lowSurrogate);
        }

        if (codeUnits.length > MAX_SIZE) {
          result += String.fromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }

        return result;
      }, '') + String.fromCharCode.apply(null, codeUnits);
    };
  }

  _.assertIsObject = function assertIsObject(subject) {
    /* istanbul ignore if */
    if (!_.isObject(subject)) {
      throw new TypeError('argument must be a object');
    }

    return subject;
  };

  /**
   * Converts the subject into a safe number within the max and min safe
   * integer range.
   *
   * @private
   * @param {*} subject The argument to be converted.
   * @return {number} Returns a safe number in range.
   */
  _.clampToSafeIntegerRange = function clampToSafeIntegerRange(subject) {
    var number = +subject;

    if (_.numIsNaN(number)) {
      number = 0;
    } else if (number < _.MIN_SAFE_INTEGER) {
      number = _.MIN_SAFE_INTEGER;
    } else if (number > _.MAX_SAFE_INTEGER) {
      number = _.MAX_SAFE_INTEGER;
    }

    return number;
  };

  if ($map && !_.hasV8Strictbug && !_.useShims) {
    _.map = function map(array) {
      return $map.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.map = function map(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        arr,
        index;

      _.assertIsFunction(callback);
      arr = [];
      arr.length = length = _.toLength(object.length);
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          arr[index] = callback.call(
            fixCall(thisArg),
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

  if ($filter && !_.hasV8Strictbug && !_.useShims) {
    _.filter = function filter(array) {
      return $filter.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.filter = function filter(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        arr,
        index,
        it;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      arr = [];
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          it = object[index];
          if (callback.call(fixCall(thisArg), it, index, object)) {
            _.push(arr, it);
          }
        }

        index += 1;
      }

      return arr;
    };
  }

  _.curry = function curry(fn) {
    var args;

    _.assertIsFunction(fn);
    args = _.chop(arguments, 1);

    return function () {
      return fn.apply(this, args.concat(_.chop(arguments)));
    };
  };

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
  /* istanbul ignore else */
  if ($forEach && !_.hasV8Strictbug && !_.useShims) {
    _.forEach = function forEach(array) {
      return $forEach.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.forEach = function forEach(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          callback.call(fixCall(thisArg), object[index], index, object);
        }

        index += 1;
      }
    };
  }

  /* istanbul ignore else */
  if ($some && !_.hasV8Strictbug && !_.useShims) {
    _.some = function some(array) {
      return $some.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.some = function some(array, callback, thisArg) {
      var object = _.toObject(array),
        val,
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = false;
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          val = !!callback.call(
            fixCall(thisArg),
            object[index],
            index, object
          );

          if (val) {
            break;
          }
        }

        index += 1;
      }

      return val;
    };
  }

  /* istanbul ignore else */
  if ($every && !_.hasV8Strictbug && !_.useShims) {
    _.every = function every(array) {
      return $every.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.every = function every(array, callback, thisArg) {
      var object = _.toObject(array),
        length,
        val,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = true;
      index = 0;
      while (index < length) {
        if (_.hasProperty(object, index)) {
          val = !!callback.call(
            fixCall(thisArg),
            object[index],
            index,
            object
          );

          if (!val) {
            break;
          }
        }

        index += 1;
      }

      return val;
    };
  }

  /* istanbul ignore else */
  if (Object.keys && !_.useShims) {
    _.keys = function keys(subject) {
      return Object.keys(_.toObject(subject));
    };
  } else {
    _.keys = function keys(subject) {
      var object = _.toObject(subject),
        ownKeys = [],
        key;

      for (key in object) {
        if (_.hasOwn(object, key)) {
          _.push(ownKeys, key);
        }
      }

      return ownKeys;
    };
  }

  /**
   * The assign function is used to copy the values of all of the
   * enumerable own properties from a source object to a target object.
   *
   * @private
   * @param {Object} target
   * @param {...Object} source
   * @return {Object}
   */
  /* istanbul ignore else */
  if (Object.assign && !_.useShims) {
    _.assign = Object.assign;
  } else {
    _.assign = function assign(target) {
      var to = _.toObject(target),
        length = _.toLength(arguments.length),
        from,
        index,
        keysArray,
        len,
        nextIndex,
        nextKey,
        arg;

      if (length >= 2) {
        index = 1;
        while (index < length) {
          arg = arguments[index];
          if (!_.isNil(arg)) {
            from = _.toObject(arg);
            keysArray = _.keys(from);
            len = keysArray.length;
            nextIndex = 0;
            while (nextIndex < len) {
              nextKey = keysArray[nextIndex];
              if (_.hasProperty(from, nextKey)) {
                to[nextKey] = from[nextKey];
              }

              nextIndex += 1;
            }
          }

          index += 1;
        }
      }

      return to;
    };
  }

  /* istanbul ignore else */
  if ($indexOf && !_.useShims) {
    _.indexOf = function indexOf(array) {
      return $indexOf.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.indexOf = function indexOf(array, searchElement, fromIndex) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        val = -1,
        index;

      if (length) {
        if (arguments.length > 1) {
          fromIndex = _.toInteger(fromIndex);
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
            if (_.hasProperty(object, index) &&
              searchElement === object[index]) {
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

  _.is = function is(x, y) {
    /*jshint singleGroups:false */
    return (x === y && (x !== 0 || 1 / x === 1 / y)) ||
      (_.numIsNaN(x) && _.numIsNaN(y));
  };

  _.IdGenerator = function IdGenerator() {
    /* istanbul ignore if */
    if (!(this instanceof IdGenerator)) {
      return new IdGenerator();
    }

    _.setValue(this, 'id', [0]);
  };

  _.setValue(_.IdGenerator.prototype, 'next', function () {
    var result = [],
      length = this.id.length,
      howMany = Math.max(length, 1),
      carry = 0,
      index = 0,
      zi;

    while (index < howMany || carry) {
      zi = carry + (index < length ? this.id[index] : 0) + !index;
      _.push(result, zi % 10);
      carry = Math.floor(zi / 10);
      index += 1;
    }

    this.id = result;

    return this;
  });

  _.setValue(_.IdGenerator.prototype, 'get', function () {
    return this.id.join('');
  });

  _.setValue(_.IdGenerator.prototype, 'reset', function () {
    this.id.length = 0;
    _.push(this.id, 0);

    return this;
  });

  // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
  _.sameValueZero = function sameValueZero(x, y) {
    /*jshint singleGroups:false */
    return (x === y) || (_.numIsNaN(x) && _.numIsNaN(y));
  };

  if ($findIndex && !_.useShims) {
    _.findIndex = function findIndex(array) {
      return $findIndex.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.findIndex = function findIndex(array, callback, thisArg) {
      var object = _.toObject(array),
        val,
        length,
        index;

      _.assertIsFunction(callback);
      length = _.toLength(object.length);
      val = -1;
      index = 0;
      while (index < length) {
        if (callback.call(fixCall(thisArg), object[index], index, object)) {
          val = index;
          break;
        }

        index += 1;
      }

      return val;
    };
  }

  function isSameValueZero(element) {
    /*jshint validthis:true */
    return _.sameValueZero(this, element);
  }

  _.getIndex = function getIndex(array, item) {
    var searchIndex;

    if (item === 0 || _.numIsNaN(item)) {
      searchIndex = _.findIndex(array, isSameValueZero, item);
    } else {
      searchIndex = _.indexOf(array, item);
    }

    return searchIndex;
  };

  if ($includes && !_.useShims) {
    _.includes = function includes(array) {
      return $includes.apply(array, _.chop(arguments, 1));
    };
  } else {
    _.includes = function includes(array, searchElement, fromIndex) {
      var object = _.toObject(array),
        length = _.toLength(object.length),
        result = false,
        index,
        n;

      if (length) {
        n = _.toLength(fromIndex);
        if (n >= 0) {
          index = n;
        } else {
          index = length + n;
          if (index < 0) {
            index = 0;
          }
        }

        while (index < length) {
          if (_.sameValueZero(searchElement, object[index])) {
            result = true;
            break;
          }

          index += 1;
        }
      }

      return result;
    };
  }

  /* istanbul ignore if */
  if (typeof define === typeFunction && define.amd) {
    /*
     * AMD. Register as an anonymous module.
     */
    define([], function () {
      return factory(_, fixCall);
    });
  } else {
    /* istanbul ignore else */
    if (typeof module === typeObject && module.exports) {
      /*
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like environments that support module.exports,
       * like Node.
       */
      module.exports = factory(_, fixCall);
    } else {
      /*jshint singleGroups:false */
      root = (
          (typeof window === 'function' || typeof window === 'object') && window
        ) ||
        (typeof self === 'object' && self) ||
        (typeof global === 'object' && global) ||
        (typeof thisArg === 'object' && thisArg) || {};

      _.setValue(root, 'reiterate', factory(_, fixCall));
    }
  }
}(

  this,

  /**
   * Factory function
   *
   * @private
   * @param {object} _
   * @param {function} fixCall
   * @return {function} The function be exported
   */
  function factory(_, fixCall) {
    'use strict';

    /* constants */
    var $reiterate,

      strDelete = 'delete',

      /**
       * The private namespace for common values.
       * @private
       * @namespace
       */
      $ = {

        DONE: {
          done: true,
          value: _.noop()
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

      initMapSet = (function () {
        function getMapSetIterator(iterable) {
          var iterator;

          if (!_.isNil(iterable)) {
            if (_.isArrayLike(iterable)) {
              iterator = $reiterate(iterable, true);
            } else if (iterable[_.symIt]) {
              iterator = iterable;
            }

            iterator = iterator[_.symIt]();
          }

          return iterator;
        }

        return function (kind, context, iterable) {
          var iterator = getMapSetIterator(iterable),
            indexof,
            next,
            key;

          if (kind === 'map') {
            _.setValue(context, '[[value]]', []);
          }

          _.setValue(context, '[[key]]', []);
          _.setValue(context, '[[order]]', []);
          _.setValue(context, '[[id]]', new _.IdGenerator());
          _.setValue(context, '[[changed]]', false);
          if (iterator) {
            next = iterator.next();
            while (!next.done) {
              key = kind === 'map' ? next.value[0] : next.value;
              indexof = _.getIndex(context['[[key]]'], key);
              if (indexof < 0) {
                if (kind === 'map') {
                  _.push(context['[[value]]'], next.value[1]);
                }

                _.push(context['[[key]]'], key);
                _.push(context['[[order]]'], context['[[id]]'].get());
                context['[[id]]'].next();
              } else if (kind === 'map') {
                context['[[value]]'][indexof] = next.value[1];
              }

              next = iterator.next();
            }
          }

          _.setValue(context, 'size', context['[[key]]'].length);
        };
      }()),

      forEachMapSet = (function () {
        function changedMapSet(id, count) {
          /*jshint validthis:true */
          this.index = count;

          return id > this.order;
        }

        return function (kind, context, callback, thisArg) {
          var pointers,
            length,
            value,
            key;

          _.assertIsObject(context);
          _.assertIsFunction(callback);
          pointers = {
            index: 0,
            order: context['[[order]]'][0]
          };

          context['[[change]]'] = false;
          length = context['[[key]]'].length;
          while (pointers.index < length) {
            if (_.hasOwn(context['[[key]]'], pointers.index)) {
              key = context['[[key]]'][pointers.index];
              value = kind === 'map' ?
                context['[[value]]'][pointers.index] :
                key;

              callback.call(fixCall(thisArg), value, key, context);
            }

            if (context['[[change]]']) {
              length = context['[[key]]'].length;
              _.some(context['[[order]]'], changedMapSet, pointers);
              context['[[change]]'] = false;
            } else {
              pointers.index += 1;
            }

            pointers.order = context['[[order]]'][pointers.index];
          }

          return context;
        };
      }()),

      hasMapSet = function (key) {
        return _.includes(_.assertIsObject(this)['[[key]]'], key);
      },

      clearMapSet = function (kind, context) {
        _.assertIsObject(context);
        context['[[id]]'].reset();
        context['[[change]]'] = true;
        context['[[key]]'].length =
          context['[[order]]'].length =
          context.size = 0;

        if (kind === 'map') {
          context['[[value]]'].length = 0;
        }

        return context;
      },

      deleteMapSet = function (kind, context, key) {
        var indexof = _.getIndex(_.assertIsObject(context)['[[key]]'], key),
          result = false;

        if (indexof > -1) {
          if (kind === 'map') {
            context['[[value]]'].splice(indexof, 1);
          }

          context['[[key]]'].splice(indexof, 1);
          context['[[order]]'].splice(indexof, 1);
          context['[[change]]'] = true;
          context.size = context['[[key]]'].length;
          result = true;
        }

        return result;
      },

      setMapSet = function (kind, context, key, value) {
        var index = _.getIndex(_.assertIsObject(context)['[[key]]'], key);

        if (kind === 'map' && index > -1) {
          context['[[value]]'][index] = value;
        } else {
          if (kind === 'map') {
            _.push(context['[[value]]'], value);
          }

          _.push(context['[[key]]'], key);
          _.push(context['[[order]]'], context['[[id]]'].get());
          context['[[id]]'].next();
          context['[[change]]'] = true;
          context.size = context['[[key]]'].length;
        }

        return context;
      },

      SetObject = (function (typeFunction) {
        var S = typeof Set === typeFunction && !_.useShims && Set,
          createSetIterator,
          SetIterator,
          typeIdenifier,
          fn,
          s;

        /* istanbul ignore if */
        if (S) {
          try {
            s = new S([0, -0]);
            if (typeof s.has !== typeFunction ||
              typeof s.add !== typeFunction ||
              typeof s.keys !== typeFunction ||
              typeof s.values !== typeFunction ||
              typeof s.entries !== typeFunction ||
              typeof s.forEach !== typeFunction ||
              typeof s.clear !== typeFunction ||
              typeof s[strDelete] !== typeFunction ||
              typeof s[_.symIt] !== typeFunction) {
              throw new Error('Missing methods');
            }

            s.add(_.noop);
            s.add(_.noop);
            s.add(_.noop);
            s.add(s);
            s.add(NaN);
            s.add(NaN);
            s.add(strDelete);
            s.add(-0);
            s.add(0);
            if (s.size !== 7) {
              throw new Error('Incorrect size');
            }
          } catch (e) {
            S = !e;
          }
        }

        /* istanbul ignore else */
        if (S) {
          fn = S;
        } else {
          typeIdenifier = 'set';

          SetIterator = function (context, iteratorKind) {
            _.setValue(this, '[[Set]]', _.assertIsObject(context));
            _.setValue(this, '[[SetNextIndex]]', 0);
            _.setValue(this, '[[SetIterationKind]]', iteratorKind || 'value');
            _.setValue(this, '[[IteratorHasMore]]', true);
          };

          _.setValue(SetIterator.prototype, 'next', function () {
            var context = _.assertIsObject(this['[[Set]]']),
              index = this['[[SetNextIndex]]'],
              iteratorKind = this['[[SetIterationKind]]'],
              more = this['[[IteratorHasMore]]'],
              object;

            if (index < context['[[key]]'].length && more) {
              object = {
                done: false
              };

              if (iteratorKind === 'key+value') {
                object.value = [
                  context['[[key]]'][index],
                  context['[[key]]'][index]
                ];
              } else {
                object.value = context['[[key]]'][index];
              }

              this['[[SetNextIndex]]'] += 1;
            } else {
              this['[[IteratorHasMore]]'] = false;
              object = _.assign({}, $.DONE);
            }

            return object;
          });

          _.setValue(SetIterator.prototype, _.symIt, _.returnThis);

          createSetIterator = function () {
            return new SetIterator(this);
          };

          fn = function Set(iterable) {
            initMapSet(typeIdenifier, this, iterable);
          };

          _.setValue(fn.prototype, 'has', hasMapSet);

          _.setValue(fn.prototype, 'add', function (key) {
            return setMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'clear', function () {
            return clearMapSet(typeIdenifier, this);
          });

          _.setValue(fn.prototype, strDelete, function (key) {
            return deleteMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            return forEachMapSet(typeIdenifier, this, callback, thisArg);
          });

          _.setValue(fn.prototype, 'values', createSetIterator);

          _.setValue(fn.prototype, 'keys', createSetIterator);

          _.setValue(fn.prototype, 'entries', function () {
            return new SetIterator(this, 'key+value');
          });

          _.setValue(fn.prototype, _.symIt, function () {
            return this.values();
          });
        }

        return fn;
      }(typeof _.isObject)),

      MapObject = (function (typeFunction) {
        var M = typeof Map === typeFunction && !_.useShims && Map,
          MapIterator,
          typeIdenifier,
          fn,
          m;

        /* istanbul ignore if */
        if (M) {
          try {
            m = new M([
              [1, 1],
              [2, 2]
            ]);

            if (typeof m.has !== typeFunction ||
              typeof m.set !== typeFunction ||
              typeof m.keys !== typeFunction ||
              typeof m.values !== typeFunction ||
              typeof m.entries !== typeFunction ||
              typeof m.forEach !== typeFunction ||
              typeof m.clear !== typeFunction ||
              typeof m[strDelete] !== typeFunction ||
              typeof m[_.symIt] !== typeFunction) {
              throw new Error('Missing methods');
            }

            m.set(_.noop, _);
            m.set(_.noop, _.noop);
            m.set(_.noop, m);
            m.set(m, _.noop);
            m.set(NaN, _);
            m.set(NaN, _.noop);
            m.set(strDelete, _.noop());
            m.set(-0, _.noop);
            m.set(0, _);
            if (m.get(0) !== _ || m.get(-0) !== _ || m.size !== 7) {
              throw new Error('Incorrect result');
            }
          } catch (e) {
            M = !e;
          }
        }

        /* istanbul ignore else */
        if (M) {
          fn = M;
        } else {
          typeIdenifier = 'map';

          MapIterator = function (context, iteratorKind) {
            _.setValue(this, '[[Map]]', _.assertIsObject(context));
            _.setValue(this, '[[MapNextIndex]]', 0);
            _.setValue(this, '[[MapIterationKind]]', iteratorKind);
            _.setValue(this, '[[IteratorHasMore]]', true);
          };

          _.setValue(MapIterator.prototype, 'next', function () {
            var context = _.assertIsObject(this['[[Map]]']),
              index = this['[[MapNextIndex]]'],
              iteratorKind = this['[[MapIterationKind]]'],
              more = this['[[IteratorHasMore]]'],
              object;

            _.assertIsObject(context);
            if (index < context['[[key]]'].length && more) {
              object = {
                done: false
              };

              if (iteratorKind === 'key+value') {
                object.value = [
                  context['[[key]]'][index],
                  context['[[value]]'][index]
                ];
              } else {
                object.value = context['[[' + iteratorKind + ']]'][index];
              }

              this['[[MapNextIndex]]'] += 1;
            } else {
              this['[[IteratorHasMore]]'] = false;
              object = _.assign({}, $.DONE);
            }

            return object;
          });

          _.setValue(MapIterator.prototype, _.symIt, _.returnThis);

          fn = function Map(iterable) {
            initMapSet(typeIdenifier, this, iterable);
          };

          _.setValue(fn.prototype, 'has', hasMapSet);

          _.setValue(fn.prototype, 'set', function (key, value) {
            return setMapSet(typeIdenifier, this, key, value);
          });

          _.setValue(fn.prototype, 'clear', function () {
            return clearMapSet(typeIdenifier, this);
          });

          _.setValue(fn.prototype, 'get', function (key) {
            var index = _.getIndex(_.assertIsObject(this)['[[key]]'], key);

            return index > -1 ? this['[[value]]'][index] : _.noop();
          });

          _.setValue(fn.prototype, strDelete, function (key) {
            return deleteMapSet(typeIdenifier, this, key);
          });

          _.setValue(fn.prototype, 'forEach', function (callback, thisArg) {
            return forEachMapSet(typeIdenifier, this, callback, thisArg);
          });

          _.setValue(fn.prototype, 'values', function () {
            return new MapIterator(this, 'value');
          });

          _.setValue(fn.prototype, 'keys', function () {
            return new MapIterator(this, 'key');
          });

          _.setValue(fn.prototype, 'entries', function () {
            return new MapIterator(this, 'key+value');
          });

          _.setValue(fn.prototype, _.symIt, function () {
            return this.entries();
          });
        }

        return fn;
      }(typeof _.isObject)),

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
        _.setValue(object, 'first', p.first);
        _.setValue(object, 'last', p.last);
        _.setValue(object, 'enumerate', g.EnumerateGenerator);
        _.setValue(object, 'unique', p.uniqueGenerator);
        _.setValue(object, 'flatten', p.flattenGenerator);
        _.setValue(object, 'compact', p.compactGenerator);
        _.setValue(object, 'initial', p.initialGenerator);
        _.setValue(object, 'rest', p.restGenerator);
        _.setValue(object, 'drop', p.dropGenerator);
        _.setValue(object, 'dropWhile', p.dropWhileGenerator);
        _.setValue(object, 'take', p.takeGenerator);
        _.setValue(object, 'takeWhile', p.takeWhileGenerator);
        _.setValue(object, 'every', p.every);
        _.setValue(object, 'some', p.some);
        _.setValue(object, 'filter', p.filterGenerator);
        _.setValue(object, 'asArray', p.asArray);
        //_.setValue(object, 'asString', p.asString);
        _.setValue(object, 'asString', p.asString);
        _.setValue(object, 'asObject', p.asObject);
        _.setValue(object, 'asMap', p.asMap);
        _.setValue(object, 'map', p.mapGenerator);
        _.setValue(object, 'reduce', p.reduce);
        _.setValue(object, 'difference', p.differenceGenerator);
        _.setValue(object, 'join', p.join);
        _.setValue(object, 'union', p.unionGenerator);
        _.setValue(object, 'intersection', p.intersectionGenerator);
        _.setValue(object, 'asSet', p.asSet);
        _.setValue(object, 'chunk', p.chunkGenerator);
        _.setValue(object, 'tap', p.tapGenerator);
        _.setValue(object, 'then', p.then);
        _.setValue(object, 'zip', p.zipGenerator);
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

          _.assertIsFunction(callback);
          if (arguments.length > 1) {
            supplied = true;
          }

          iterator = this[_.symIt]();
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

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              itertor,
              next;

            return {
              next: function () {
                var object;

                itertor = itertor || generator();
                next = next && next.done ? next : itertor.next();
                if (!next.done) {
                  callback.call(fixCall(thisArg), next.value, index);
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
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

          _.assertIsFunction(callback);
          iterator = this[_.symIt]();
          next = iterator.next();
          result = true;
          index = 0;
          while (result && !next.done) {
            if (!callback.call(fixCall(thisArg), next.value, index)) {
              result = false;
            } else {
              next = iterator.next();
              index += 1;
            }
          }

          return result;
        },

        some: function (callback, thisArg) {
          var iterator,
            result,
            index,
            next;

          _.assertIsFunction(callback);
          iterator = this[_.symIt]();
          next = iterator.next();
          result = false;
          index = 0;
          while (!result && !next.done) {
            if (callback.call(fixCall(thisArg), next.value, index)) {
              result = true;
            } else {
              next = iterator.next();
              index += 1;
            }
          }

          return result;
        },

        asArray: function () {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            result = [];

          while (!next.done) {
            _.push(result, next.value);
            next = iterator.next();
          }

          return result;
        },

        join: function (seperator) {
          var iterator = this[_.symIt](),
            next = iterator.next(),
            result = '',
            after;

          if (_.isUndefined(seperator)) {
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
          var iterator = this[_.symIt](),
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

        asMap: (function (typeFunction) {
          return function (CustomMap) {
            var iterator = this[_.symIt](),
              next = iterator.next(),
              result,
              index;

            if (arguments.length) {
              _.assertIsFunction(CustomMap);
              result = new CustomMap();
            } else if (typeof Map === typeFunction) {
              result = new Map();
            }

            if (!next.done) {
              index = 0;
              while (!next.done) {
                result.set(index, next.value);
                next = iterator.next();
                index += 1;
              }
            }

            return result;
          };
        }(typeof _.isObject)),

        asSet: (function (typeFunction) {
          return function (CustomSet) {
            var iterator = this[_.symIt](),
              next = iterator.next(),
              result;

            if (arguments.length) {
              _.assertIsFunction(CustomSet);
              result = new CustomSet();
            } else if (typeof Set === typeFunction) {
              result = new Set();
            }

            while (!next.done) {
              result.add(next.value);
              next = iterator.next();
            }

            return result;
          };
        }(typeof _.isObject)),

        /*
        asSetOwn: function () {
          var iterator = this[_.symIt](),
            next;

          do {
            next = iterator.next();
          } while (!next.done);

          return next.value;
        },
        */

        dropGenerator: function (number) {
          var generator = this[_.symIt],
            howMany = _.toLength(number);

          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && index < howMany ? next : iterator.next();
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
                  object = _.assign({}, $.DONE);
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

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              dropped,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && !dropped ? next : iterator.next();
                while (!dropped && !next.done && callback.call(
                    fixCall(thisArg),
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
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeGenerator: function (number) {
          var generator = this[_.symIt],
            howMany = _.toLength(number);

          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && index >= howMany ? next : iterator.next();
                if (!next.done && index < howMany) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        takeWhileGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                if (!next.done && callback.call(
                    fixCall(thisArg),
                    next.value,
                    index
                  )) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        chunkGenerator: function (size) {
          var generator = this[_.symIt],
            howMany = _.toLength(size) || 1;

          this[_.symIt] = function () {
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
                  _.push(chunk, next.value);
                  next = iterator.next();
                }

                /*jshint singleGroups:false */
                if (!next.done || (chunk && chunk.length)) {
                  object = {
                    done: false,
                    value: chunk
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        compactGenerator: function () {
          var generator = this[_.symIt];

          this[_.symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                while (!next.done && !next.value) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        differenceGenerator: function (values) {
          var generator = this[_.symIt],
            set;

          this[_.symIt] = function () {
            var iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                set = set || new SetObject($reiterate(values).values());
                while (!next.done && set.has(next.value)) {
                  next = iterator.next();
                }

                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        initialGenerator: function () {
          var generator = this[_.symIt];

          this[_.symIt] = function () {
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
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        first: function () {
          var next = this[_.symIt]().next();

          return next.done ? _.noop() : next.value;
        },

        last: function () {
          var iterator = this[_.symIt](),
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
          var generator = this[_.symIt];

          this[_.symIt] = function () {
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
                  object = _.assign({}, $.DONE);
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
            return argSet.has(this.value);
          }

          function push(argSets, arg) {
            if (_.isArrayLike(arg) || _.isFunction(arg[_.symIt])) {
              _.push(argSets, new SetObject($reiterate(arg)));
            }

            return argSets;
          }

          return function () {
            var generator = this[_.symIt],
              args = arguments;

            this[_.symIt] = function () {
              var iterator,
                argSets,
                seen,
                next;

              return {
                next: function () {
                  var object;

                  argSets = argSets || _.reduce(args, push, []);
                  seen = seen || new SetObject();
                  iterator = iterator || generator();
                  next = next && next.done ? next : iterator.next();
                  while (!next.done) {
                    if (!seen.has(next.value)) {
                      if (_.every(argSets, has, next)) {
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
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            };

            return this;
          };
        }()),

        unionGenerator: function () {
          var generator = this[_.symIt],
            args = arguments;


          this[_.symIt] = function () {
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
                next = next && next.done ? next : iterator.next();
                while (!next.done && !outerIt) {
                  if (!seen.has(next.value)) {
                    seen.add(next.value);
                    //yield next.value
                    break;
                  }

                  next = iterator.next();
                }

                if (next.done && args.length) {
                  outerIt = outerIt || new g.ArrayGenerator(args)[_.symIt]();
                  if (!innerNext || innerNext.done) {
                    outerNext = outerIt.next();
                  }

                  while (!outerNext.done || !innerNext) {
                    if (_.isArrayLike(outerNext.value) ||
                      _.isFunction(outerNext.value[_.symIt])) {
                      /*jshint singleGroups:false */
                      if (!innerIt || (innerNext && innerNext.done)) {
                        if (_.isArrayLike(outerNext.value)) {
                          innerIt =
                            $reiterate(outerNext.value, true)[_.symIt]();
                        } else {
                          innerIt = outerNext.value[_.symIt]();
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
                  object = _.assign({}, $.DONE);
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
              _.push(zip.value, _.noop());
            } else {
              _.push(zip.value, next.value);
              zip.done = false;
            }

            return zip;
          }

          function push(iterators, arg) {
            if (_.isArrayLike(arg) || _.isFunction(arg[_.symIt])) {
              _.push(iterators, $reiterate(arg, true)[_.symIt]());
            }

            return iterators;
          }

          return function () {
            var generator = this[_.symIt],
              args = arguments;

            this[_.symIt] = function () {
              var iterators,
                next;

              return {
                next: function () {
                  var object;

                  iterators = iterators || _.reduce(args, push, [generator()]);
                  while (!next || !next.done) {
                    next = _.reduce(iterators, ofNext, {
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
                    object = _.assign({}, $.DONE);
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
            var generator = this[_.symIt];

            this[_.symIt] = function () {
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
                      if (_.isArray(next.value, relaxed)) {
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
                        if (_.isArray(value, relaxed)) {
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
                    object = _.assign({}, $.DONE);
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
            var iterator = this[_.symIt](),
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
                  value = object[next.value];
                  if (_.isObject(value)) {
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

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: callback.call(fixCall(thisArg), next.value, index)
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        filterGenerator: function (callback, thisArg) {
          var generator;

          _.assertIsFunction(callback);
          generator = this[_.symIt];
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                iterator = iterator || generator();
                next = next && next.done ? next : iterator.next();
                while (!next.done &&
                  !callback.call(fixCall(thisArg), next.value, index)) {
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
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };

          return this;
        },

        then: function (gen) {
          var generator = this[_.symIt],
            context;

          if (!_.isUndefined(gen)) {
            if (!_.isFunction(gen)) {
              throw new TypeError(
                'If not undefined, generator must be a function'
              );
            }

            context = new g.ThenGenerator(gen, this, _.chop(arguments, 1));
          } else {
            this[_.symIt] = function () {
              var index = 0,
                iterator,
                next;

              return {
                next: function () {
                  var object;

                  iterator = iterator || generator();
                  next = next && next.done ? next : iterator.next();
                  if (!next.done) {
                    object = {
                      done: false,
                      value: next.value
                    };

                    index += 1;
                  } else {
                    object = _.assign({}, $.DONE);
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
          this[_.symIt] = function () {
            var index = 0,
              iterator,
              next;

            return {
              next: function () {
                var object;

                if (!iterator) {
                  if (_.isFunction(generator)) {
                    iterator = generator.apply(context, argsArray);
                  } else {
                    iterator = generator[_.symIt]();
                  }
                }

                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };

                  index += 1;
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          };
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
                    object = _.assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.from) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
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
                    object = _.assign({}, $.DONE);
                  }
                } else {
                  if (count >= opts.to) {
                    object = {
                      done: false,
                      value: count
                    };

                    count -= opts.by;
                  } else {
                    object = _.assign({}, $.DONE);
                  }
                }

                return object;
              }
            };
          }

          function countGenerator(opts) {
            var iterator,
              next;

            if (!iterator) {
              if (opts.reversed) {
                iterator = countReverseGenerator(opts);
              } else {
                iterator = countForwardGenerator(opts);
              }
            }

            return {
              next: function () {
                next = next && next.done ? next : iterator.next();

                return next;
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
              to: _.MAX_SAFE_INTEGER,
              by: 1
            };

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
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
          function arrayGenerator(subject, opts) {
            var generator,
              counter,
              iterator,
              next;

            if (opts.length) {
              generator = g.CounterGenerator();
              generator.from(opts.from).to(opts.to).by(opts.by);
              setReverseIfOpt(opts, generator);
              iterator = {
                next: function () {
                  var object;

                  counter = counter || generator[_.symIt]();
                  next = next && next.done ? next : counter.next();
                  if (!next.done) {
                    object = {
                      done: false,
                      value: getYieldValue(opts, subject, next.value)
                    };
                  } else {
                    object = _.assign({}, $.DONE);
                  }

                  return object;
                }
              };
            } else {
              iterator = {
                next: function () {
                  return _.assign({}, $.DONE);
                }
              };
            }

            return iterator;
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
              }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
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
              result = _.fromCodePoint(_.codePointAt(character));
            } else {
              result = [key, _.fromCodePoint(_.codePointAt(character))];
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
                  return _.assign({}, $.DONE);
                }
              };
            }

            generator = g.CounterGenerator(opts);
            generator.from(opts.from).to(opts.to).by(opts.by);
            setReverseIfOpt(opts, generator);
            iterator = {
              next: function () {
                var object,
                  char1,
                  char2;

                counter = counter || generator[_.symIt]();
                next = next || counter.next();
                if (!next.done) {
                  while (!next.done && !object) {
                    if (!isPair) {
                      if (opts.reversed) {
                        char1 = subject[next.value - 1];
                        char2 = subject[next.value];
                        isPair = _.isSurrogatePair(char1, char2);
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
                        isPair = _.isSurrogatePair(char1, char2);
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

                return object || _.assign({}, $.DONE);
              }
            };

            return iterator;
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
              }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
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

              setIndexesOpts(start, end, opts);
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
          function enumerateGenerator(subject, opts) {
            var iterator,
              keys,
              next,
              key;

            if (opts.own) {
              keys = _.keys(subject);
            } else {
              keys = [];
              for (key in subject) {
                /*jshint forin:false */
                _.push(keys, key);
              }
            }

            return {
              next: function () {
                var object;

                iterator = iterator || new g.ArrayGenerator(keys)[_.symIt]();
                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: getYieldValue(opts, subject, next.value)
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          }

          function EnumerateGenerator(subject) {
            if (!(this instanceof EnumerateGenerator)) {
              return new EnumerateGenerator(subject);
            }

            var opts = _.assign({
              own: false
            }, $.OPTS.VALUES);

            _.setValue(this, 'state', function () {
              return _.assign({}, opts);
            });

            _.setValue(this, _.symIt, function () {
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

            _.setValue(this, _.symIt, function () {
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

            if (_.isArrayLike(array) || _.isFunction(array[_.symIt])) {
              first = $reiterate(array).first();
              if (!_.isObjectLike(first)) {
                first = [];
              }

              rest = $reiterate(array).rest().asArray();
            } else {
              first = rest = [];
            }

            return {
              next: function () {
                var object;

                iterator = iterator || p.zipGenerator.apply(
                  $reiterate(first, true),
                  rest
                )[_.symIt]();

                next = next && next.done ? next : iterator.next();
                if (!next.done) {
                  object = {
                    done: false,
                    value: next.value
                  };
                } else {
                  object = _.assign({}, $.DONE);
                }

                return object;
              }
            };
          }

          function UnzipGenerator(subject) {
            if (!(this instanceof UnzipGenerator)) {
              return new UnzipGenerator(subject);
            }

            _.setValue(this, _.symIt, function () {
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

      $reiterate = function reiterate(subject, to, by) {
        var generator;

        if (_.isNil(subject) || _.isNumber(subject)) {
          generator = makeCounterGenerator(subject, to, by);
        } else if (_.isArray(subject, to)) {
          generator = new g.ArrayGenerator(subject);
        } else if (_.isString(subject)) {
          generator = new g.StringGenerator(subject);
        } else if (_.isFunction(subject[_.symIt])) {
          generator = new g.ThenGenerator(subject, {}, _.chop(arguments, 1));
        } else {
          generator = new g.EnumerateGenerator(subject);
        }

        return generator;
      };

      /*
       * Static methods
       */
      _.setValue($reiterate, '$', {});
      _.setValue($reiterate.$, 'Map', MapObject);
      _.setValue($reiterate.$, 'Set', SetObject);
      _.forEach(_.keys(_), function (key) {
        _.setValue($reiterate.$, key, _[key]);
      });

      _.setValue($reiterate, 'array', g.ArrayGenerator);
      _.setValue($reiterate, 'string', g.StringGenerator);
      _.setValue($reiterate, 'enumerate', g.EnumerateGenerator);
      _.setValue($reiterate, 'repeat', g.RepeatGenerator);
      _.setValue($reiterate, 'unzip', g.UnzipGenerator);
      _.setValue($reiterate, 'iterator', _.symIt);

      return $reiterate;
    }());
  }

));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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
  : typedArraySupport()

function typedArraySupport () {
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
}

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
  this[offset] = (value & 0xff)
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
    this[offset] = (value & 0xff)
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
    this[offset + 1] = (value & 0xff)
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
    this[offset] = (value & 0xff)
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
    this[offset + 3] = (value & 0xff)
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
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
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
    this[offset + 1] = (value & 0xff)
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
    this[offset] = (value & 0xff)
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
    this[offset + 3] = (value & 0xff)
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
(function (process,global){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, es3:true, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global window, self, global, module, require, process */
/* istanbul ignore next */
(function (context) {
  'use strict';

  module.exports.global = context;

  function toStringTag(subject) {
    return Object.prototype.toString.call(subject);
  }

  module.exports.toStringTag = toStringTag;

  module.exports.isStrictMode = function isStrictMode() {
    return (function () {
      return !this;
    }());
  };

  module.exports.expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/reiterate.min');
  } else {
    module.exports.subject = require('../lib/reiterate');
  }

  var $ = module.exports.subject.$;

  module.exports.isGeneratorSupported = (function () {
    try {
      /*jshint evil:true */
      eval('(function*(){})()');
      return true;
    } catch (e) {
      return !e;
    }
  }());

  module.exports.isNativeSymbolIterator = $.isSymbol($.symIt);

  module.exports.forOf = (function () {
    var val,
      fn;

    try {
      /*jshint evil:true */
      fn = new Function('return function(iterable,callback,thisArg){for(' +
        'var item of iterable)if(callback.call(thisArg,item))break};')();

      val = 1;
      fn([1, 2, 3], function (entry) {
        if (entry !== val) {
          throw new Error();
        }

        val += 1;
      });

      if (val !== 4) {
        throw new Error();
      }

      val = 1;
      fn('123', function (entry) {
        if (entry !== String(val)) {
          throw new Error();
        }

        val += 1;
      });

      if (val !== 4) {
        throw new Error();
      }

      module.exports.isForOfSupported = true;
    } catch (e) {
      fn = module.exports.isForOfSupported = !e;
    }

    if (!fn) {
      fn = function (iterable, callback, thisArg) {
        var generator = iterable[$.symIt],
          iterator = generator(),
          next = iterator.next();

        while (!next.done && !callback.call(thisArg, next.value)) {
          next = iterator.next();
        }
      };
    }

    return fn;
  }());

  module.exports.create = function (varArgs) {
    var length = arguments.length,
      result = [],
      sliced,
      idx,
      it;

    if (!length) {
      result.length = 0;
    } else if (length === 1) {
      if ($.isNumber(varArgs)) {
        result.length = varArgs;
      } else if ($.isString(varArgs)) {
        sliced = varArgs.slice(1, -1).replace(/^\s+|\s+$/g, '');
        if (sliced[sliced.length - 1] === ',') {
          sliced = sliced.slice(0, -1);
        }

        sliced = sliced.split(',');
        length = sliced.length;
        for (idx = 0; idx < length; idx += 1) {
          it = sliced[idx].replace(/^\s+|\s+$/g, '');
          if (it) {
            /*jshint evil: true */
            result[idx] = eval(it);
            if (idx + 1 > result.length) {
              result.length = idx + 1;
            }
          }
        }
      } else {
        result[0] = varArgs;
        result.length = 1;
      }
    } else {
      for (idx = 0; idx < length; idx += 1) {
        result[idx] = arguments[idx];
        if (idx + 1 > result.length) {
          result.length = idx + 1;
        }
      }
    }

    return result;
  };

  module.exports.array2Object = function array2Object(array) {
    var object = $.toObject(array),
      accumulator = {},
      length,
      index;

    if (!$.isFunction(object)) {
      accumulator.length = length = $.toLength(object.length);
      for (index = 0; index < length; index += 1) {
        if (index in object) {
          accumulator[index] = object[index];
        }
      }
    } else {
      accumulator.length = 0;
    }

    return accumulator;
  };

}(
  /*jshint singleGroups:false */
  ((typeof window === 'function' || typeof window === 'object') && window) ||
  (typeof self === 'object' && self) ||
  (typeof global === 'object' && global) ||
  (typeof this === 'object' && this) || {}
));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/reiterate":1,"../lib/reiterate.min":2,"_process":7,"expect.js":8}],10:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, es3:true, plusplus:true, maxparams:3, maxdepth:2,
    maxstatements:29, maxcomplexity:3
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    MapObject = reiterate.$.Map,
    SetObject = reiterate.$.Set;

  describe('Basic tests', function () {
    var proto = '__proto__';

    it('MapObject existence', function () {
      expect(MapObject).to.be.ok();
    });

    it('MapObject constructor behavior', function () {
      expect(new MapObject()).to.be.a(MapObject);
      var a = 1,
        b = {},
        c = new MapObject(),
        m = new MapObject([
          [1, 1],
          [b, 2],
          [c, 3]
        ]);

      expect(m.has(a)).to.be.ok();
      expect(m.has(b)).to.be.ok();
      expect(m.has(c)).to.be.ok();
      expect(m.size).to.be(3);
      if (proto in {}) {
        expect(new MapObject()[proto].isPrototypeOf(new MapObject()))
          .to.be.ok();
        expect(new MapObject()[proto]).to.be(MapObject.prototype);
      }
    });

    it('MapObject#size - Mozilla only', function () {
      var o = new MapObject();

      if ('size' in o) {
        expect(o.size).to.be(0);
        o.set('a', 'a');
        expect(o.size).to.be(1);
        o['delete']('a');
        expect(o.size).to.be(0);
      }
    });

    it('MapObject#has', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      expect(o.has(callback)).to.not.be.ok();
      o.set(callback, generic);
      expect(o.has(callback)).to.be.ok();
    });

    it('MapObject#get', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      //:was assert(o.get(callback, 123) === 123);
      o.set(callback, generic);
      expect(o.get(callback, 123)).to.be(generic);
      expect(o.get(callback)).to.be(generic);
    });

    it('MapObject#set', function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      o.set(callback, generic);
      expect(o.get(callback)).to.be(generic);
      o.set(callback, callback);
      expect(o.get(callback)).to.be(callback);
      o.set(callback, o);
      expect(o.get(callback)).to.be(o);
      o.set(o, callback);
      expect(o.get(o)).to.be(callback);
      o.set(NaN, generic);
      expect(o.has(NaN)).to.be.ok();
      expect(o.get(NaN)).to.be(generic);
      o.set('key', undefined);
      expect(o.has('key')).to.be.ok();
      expect(o.get('key')).to.be(undefined);

      expect(!o.has(-0)).to.be.ok();
      expect(!o.has(0)).to.be.ok();
      o.set(-0, callback);
      expect(o.has(-0)).to.be.ok();
      expect(o.has(0)).to.be.ok();
      expect(o.get(-0)).to.be(callback);
      expect(o.get(0)).to.be(callback);
      o.set(0, generic);
      expect(o.has(-0)).to.be.ok();
      expect(o.has(0)).to.be.ok();
      expect(o.get(-0)).to.be(generic);
      expect(o.get(0)).to.be(generic);
    });

    it("MapObject#['delete']", function () {
      var o = new MapObject(),
        generic = {},
        callback = function () {};

      o.set(callback, generic);
      o.set(generic, callback);
      o.set(o, callback);
      expect(o.has(callback) && o.has(generic) && o.has(o)).to.be.ok();
      o['delete'](callback);
      o['delete'](generic);
      o['delete'](o);
      expect(!o.has(callback) && !o.has(generic) && !o.has(o)).to.be.ok();
      expect(o['delete'](o)).to.not.be.ok();
      o.set(o, callback);
      expect(o['delete'](o)).to.be.ok();
    });

    it('non object key does not throw an error', function () {
      var o = new MapObject();

      try {
        o.set('key', o);
      } catch (emAll) {
        expect(false).to.be.ok();
      }
    });

    it('keys, values, entries behavior', function () {
      // test that things get returned in insertion order as per the specs
      var o = new MapObject([
          ['1', 1],
          ['2', 2],
          ['3', 3]
        ]),
        keys = o.keys(),
        values = o.values(),
        k = keys.next(),
        v = values.next(),
        e;

      expect(k.value === '1' && v.value === 1).to.be.ok();
      o['delete']('2');
      k = keys.next();
      v = values.next();
      expect(k.value === '3' && v.value === 3).to.be.ok();
      // insertion of previously-removed item goes to the end
      o.set('2', 2);
      k = keys.next();
      v = values.next();
      expect(k.value === '2' && v.value === 2).to.be.ok();
      // when called again, new iterator starts from beginning
      var entriesagain = o.entries();

      expect(entriesagain.next().value[0]).to.be('1');
      expect(entriesagain.next().value[0]).to.be('3');
      expect(entriesagain.next().value[0]).to.be('2');
      // after a iterator is finished, don't return any more elements
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      o.set('4', 4);
      k = keys.next();
      v = values.next();
      expect(k.done && v.done).to.be.ok();
      // new element shows up in iterators that didn't yet
      e = entriesagain.next();
      expect(e.done).to.not.be.ok();
      expect(e.value[0]).to.be('4');
      expect(entriesagain.next().done).to.be.ok();
    });

    it('MapObject#forEach', function () {
      var o = new MapObject();

      o.set('key 0', 0);
      o.set('key 1', 1);
      o.forEach(function (value, key, obj) {
        expect('key ' + value).to.be(key);
        expect(obj).to.be(o);
        // even if dropped, keeps looping
        o['delete'](key);
      });

      expect(!o.size).to.be.ok();
    });

    it('MapObject#forEach with mutations', function () {
      var o = new MapObject([
          ['0', 0],
          ['1', 1],
          ['2', 2]
        ]),
        seen = [];

      o.forEach(function (value, key, obj) {
        seen.push(value);
        expect(obj).to.be(o);
        expect('' + value).to.be(key);
        // mutations work as expected
        if (value === 1) {
          o['delete']('0'); // remove from before current index
          o['delete']('2'); // remove from after current index
          o.set('3', 3); // insertion
        } else if (value === 3) {
          o.set('0', 0); // insertion at the end
        }
      });

      expect(seen).to.eql([0, 1, 3, 0]);
    });

    it('MapObject#clear', function () {
      var o = new MapObject();

      o.set(1, '1');
      o.set(2, '2');
      o.set(3, '3');
      o.clear();
      expect(!o.size).to.be.ok();
    });

    it('SetObject existence', function () {
      expect(SetObject).to.be.ok();
    });

    it('SetObject constructor behavior', function () {
      expect(new SetObject()).to.be.a(SetObject);
      var s = new SetObject([1, 2]);

      expect(s.has(1)).to.be.ok();
      expect(s.has(2)).to.be.ok();
      expect(s.size).to.be(2);
      if (proto in {}) {
        expect(new SetObject()[proto].isPrototypeOf(new SetObject()))
          .to.be.ok();
        expect(new SetObject()[proto]).to.be(SetObject.prototype);
      }
    });

    it('SetObject#size - Mozilla only', function () {
      var o = new SetObject();

      if ('size' in o) {
        expect(o.size).to.be(0);
        o.add('a');
        expect(o.size).to.be(1);
        o['delete']('a');
        expect(o.size).to.be(0);
      }
    });

    it('SetObject#add', function () {
      var o = new SetObject();

      expect(o.add(NaN)).to.be.ok();
      expect(o.has(NaN)).to.be.ok();
    });

    it("SetObject#['delete']", function () {
      var o = new SetObject(),
        generic = {},
        callback = function () {};

      o.add(callback);
      o.add(generic);
      o.add(o);
      expect(o.has(callback) && o.has(generic) && o.has(o)).to.be.ok();
      o['delete'](callback);
      o['delete'](generic);
      o['delete'](o);
      expect(!o.has(callback) && !o.has(generic) && !o.has(o)).to.be.ok();
      expect(o['delete'](o)).to.not.be.ok();
      o.add(o);
      expect(o['delete'](o)).to.be.ok();
    });

    it('values behavior', function () {
      // test that things get returned in insertion order as per the specs
      var o = new SetObject([1, 2, 3]);

      expect(o.keys).to.be(o.values); // same function, as per the specs
      var values = o.values(),
        v = values.next();

      expect(v.value).to.be(1);
      o['delete'](2);
      v = values.next();
      expect(v.value).to.be(3);
      // insertion of previously-removed item goes to the end
      o.add(2);
      v = values.next();
      expect(v.value).to.be(2);
      // when called again, new iterator starts from beginning
      var entriesagain = o.entries();
      expect(entriesagain.next().value[1]).to.be(1);
      expect(entriesagain.next().value[1]).to.be(3);
      expect(entriesagain.next().value[1]).to.be(2);
      // after a iterator is finished, don't return any more elements
      v = values.next();
      expect(v.done).to.be.ok();
      v = values.next();
      expect(v.done).to.be.ok();
      o.add(4);
      v = values.next();
      expect(v.done).to.be.ok();
      // new element shows up in iterators that didn't yet finish
      expect(entriesagain.next().value[1]).to.be(4);
      expect(entriesagain.next().done).to.be.ok();
    });

    it('SetObject#has', function () {
      var o = new SetObject(),
        callback = function () {};

      expect(o.has(callback)).to.not.be.ok();
      o.add(callback);
      expect(o.has(callback)).to.be.ok();
    });

    it('SetObject#forEach', function () {
      var o = new SetObject(),
        i = 0;

      o.add('value 0');
      o.add('value 1');
      o.forEach(function (value, sameValue, obj) {
        expect('value ' + i).to.be(value);
        i += 1;
        expect(obj).to.be(o);
        expect(sameValue).to.be(value);
        // even if dropped, keeps looping
        o['delete'](value);
      });

      expect(!o.size).to.be.ok();
    });

    it('SetObject#forEach with mutations', function () {
      var o = new SetObject([0, 1, 2]),
        seen = [];

      o.forEach(function (value, sameValue, obj) {
        seen.push(value);
        expect(obj).to.be(o);
        expect(sameValue).to.be(value);
        // mutations work as expected
        if (value === 1) {
          o['delete'](0); // remove from before current index
          o['delete'](2); // remove from after current index
          o.add(3); // insertion
        } else if (value === 3) {
          o.add(0); // insertion at the end
        }
      });

      expect(seen).to.eql([0, 1, 3, 0]);
    });

    it('SetObject#clear', function () {
      var o = new SetObject();

      o.add(1);
      o.add(2);
      o.clear();
      expect(!o.size).to.be.ok();
    });

    it('Set#add, Map#set are chainable now', function () {
      var s = new SetObject(),
        m = new MapObject(),
        a = {};

      s.add(1).add(2);
      expect(s.has(1) && s.has(2) && s.size).to.be(2);

      m.set(1, 1).set(a, 2);
      expect(m.has(1) && m.has(a) && m.size).to.be(2);
    });

    it('Recognize any iterable as the constructor input', function () {
      var a = new SetObject(new SetObject([1, 2]));

      expect(a.has(1)).to.be.ok();
    });
  });
}());

},{"../scripts/":9}],11:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:12,
    maxcomplexity:2
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
        reiterate(new reiterate.$.Map());
      }).to.not.throwException();

      expect(function () {
        reiterate(new reiterate.$.Set());
      }).to.not.throwException();

      expect(function () {
        reiterate(/a\ regex/);
      }).to.not.throwException();
    });
  });
}());

},{"../scripts/":9}],12:[function(require,module,exports){
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
    reiterate = required.subject,
    symIt = reiterate.iterator,
    forOf = required.forOf,
    reduce = reiterate.$.reduce,
    isGeneratorSupported = required.isGeneratorSupported,
    MAX_SAFE_INTEGER = reiterate.$.MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER = reiterate.$.MIN_SAFE_INTEGER,
    aGenerator;

  if (isGeneratorSupported) {
    /*jshint evil:true */
    aGenerator = new Function('reduce', 'return function*(){var x=reduce(' +
      'arguments,function(acc,arg){return acc+arg},0),item;' +
      'for(item of this)yield item*2+x};')(reduce);
  } else {
    aGenerator = function () {
      var generator = this,
        args = arguments,
        iterator,
        next,
        done,
        x;

      return {
        next: function () {
          var object;

          if (!done) {
            x = reduce(args, function (acc, arg) {
              return acc + arg;
            }, 0);

            done = true;
          }

          iterator = iterator || generator[symIt]();
          next = iterator.next();
          if (!next.done) {
            object = {
              done: false,
              value: next.value * 2 + x
            };
          } else {
            object = {
              done: true,
              value: undefined
            };
          }

          return object;
        }
      };
    };
  }

  describe('Basic tests', function () {
    it('Counter simple', function () {
      var index = 0;

      // forward
      forOf(reiterate(), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(undefined), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(null), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(9), function (entry) {
        expect(entry).to.be.within(0, 9);
        expect(entry).to.be(index);
        index += 1;
      });

      // reverse
      index = MAX_SAFE_INTEGER;
      forOf(reiterate().reverse(), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = MAX_SAFE_INTEGER;
      forOf(reiterate(undefined).reverse(), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = MAX_SAFE_INTEGER;
      forOf(reiterate(null).reverse(), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = -9;
      forOf(reiterate(-9).reverse(), function (entry) {
        expect(entry).to.be.within(-9, 0);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter specific arguments', function () {
      var index = 0;

      // forward
      forOf(reiterate(0, 10), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate(-10, 0), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      });

      index = 10;
      forOf(reiterate(10, -20), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = -20;
      forOf(reiterate(-20, -10), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 1;
      });

      // reverse
      index = 10;
      forOf(reiterate(0, 10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate(10, 0).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(-10, 0).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = -10;
      forOf(reiterate(0, -10).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter with by', function () {
      var index = 0;

      // forward
      forOf(reiterate(0, 10, 1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate(-10, 0, 2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate(10, -20, 3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate(-20, -10, -2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate(0, 10, 1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate(10, 0, 2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate(-10, 0, 3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate(0, -10, -2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter zeros', function () {
      var index = 0;

      index = 0;
      forOf(reiterate(0), function (entry) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(0, 0), function (entry) {
        expect(entry).to.eql(index);
        expect(0).to.eql(index);
        index += 1;
      });

      index = 0;
      expect(function () {
        reiterate(0, 10, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Counter simple mixed sugar', function () {
      var index = 10;

      // forward
      forOf(reiterate().from(10), function (entry) {
        expect(entry).to.be.within(10, MAX_SAFE_INTEGER);
        expect(entry).to.eql(index);
        index += 1;
        if (index > 20) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(undefined).to(10), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
        if (index > 10) {
          return true;
        }
      });

      index = 0;
      forOf(reiterate(null).by(2), function (entry) {
        expect(entry).to.be.within(0, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index += 2;
        if (index > 10) {
          return true;
        }
      });

      index = 10;
      forOf(reiterate().from(10).to(20).by(2), function (entry) {
        expect(entry).to.be.within(10, 20);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = MAX_SAFE_INTEGER;
      forOf(reiterate().from(10).reverse(), function (entry) {
        expect(entry).to.be.within(10, MAX_SAFE_INTEGER);
        expect(entry).to.be(index);
        index -= 1;
        if (index < MAX_SAFE_INTEGER - 10) {
          return true;
        }
      });

      index = 10;
      forOf(reiterate(undefined).to(10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 10;
      forOf(reiterate().from(0).to(10).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 2;
      });
    });

    it('Counter using sugar', function () {
      var index = 0;

      // NaN
      forOf(reiterate().from(NaN).to(NaN).by(1), function (entry) {
        expect(entry).to.be(0);
        index += 1;
      });

      // forward
      index = 0;
      forOf(reiterate().from(0).to(10).by(1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate().from(-10).to(0).by(2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate().from(10).to(-20).by(3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate().from(-20).to(-10).by(2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate().from(0).to(10).by(1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(10).to(0).by(2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate().from(0).to(-10).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter zeros', function () {
      var index = 0;

      index = 0;
      forOf(reiterate(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate(0, 0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      expect(function () {
        reiterate(0, 0, 0);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      index = 0;
      forOf(reiterate().to(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

      index = 0;
      forOf(reiterate().from(0).to(0), function (entry) {
        expect(entry).to.be(index);
        expect(0).to.be(index);
        index += 1;
      });

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
      forOf(reiterate().from(-Infinity).to(Infinity), function (entry) {
        expect(entry).to.be(MIN_SAFE_INTEGER);
        return true;
      });

      forOf(reiterate().from(Infinity).to(-Infinity), function (entry) {
        expect(entry).to.be(MAX_SAFE_INTEGER);
        return true;
      });
    });

    it('Counter next', function () {
      var generator = reiterate().from(0).to(3).by(1),
        iterator = generator[symIt]();

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
        iterator = generator[symIt]();

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
        counter;

      expect(function () {
        forOf(reiterate().map(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate().from(65).to(90).map(function (value) {
          return String.fromCharCode(value);
        });
      }).to.not.throwException();

      index = 65;
      forOf(counter, function (entry) {
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
    });

    it('Counter map filter', function () {
      var index,
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
      forOf(counter, function (entry) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
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
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then();
      }).to.not.throwException();

      forOf(iterator, function (entry) {
        expect(index).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Counter then aGenerator', function () {
      var index = 0,
        iterator;

      expect(function () {
        iterator = reiterate().from(0).to(10).then(aGenerator);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      forOf(iterator, function (entry) {
        expect(index).to.be.within(0, 10);
        expect(entry).to.be(index * 2);
        index += 1;
      });
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
      var index = 0;

      // forward
      forOf(reiterate().from(0).to(10).by(1), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.eql(index);
        index += 1;
      });

      index = -10;
      forOf(reiterate().from(-10).to(0).by(2), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 10;
      forOf(reiterate().from(10).to(-20).by(3), function (entry) {
        expect(entry).to.be.within(-20, 10);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -20;
      forOf(reiterate().from(-20).to(-10).by(2), function (entry) {
        expect(entry).to.be.within(-20, -10);
        expect(entry).to.be(index);
        index += 2;
      });

      // reverse
      index = 10;
      forOf(reiterate().from(0).to(10).by(1).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index -= 1;
      });

      index = 0;
      forOf(reiterate().from(10).to(0).by(2).reverse(), function (entry) {
        expect(entry).to.be.within(0, 10);
        expect(entry).to.be(index);
        index += 2;
      });

      index = 0;
      forOf(reiterate().from(-10).to(0).by(3).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index -= 3;
      });

      index = -10;
      forOf(reiterate().from(0).to(-10).by(-2).reverse(), function (entry) {
        expect(entry).to.be.within(-10, 0);
        expect(entry).to.be(index);
        index += 2;
      });
    });

    it('Counter tap', function () {
      var index = 10,
        array;

      expect(function () {
        forOf(reiterate().tap(), function () {
          return true;
        });
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
        forOf(reiterate().reduce(), function () {
          return true;
        });
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
        from: MIN_SAFE_INTEGER,
        to: MAX_SAFE_INTEGER,
        by: MAX_SAFE_INTEGER
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
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:56,
    maxcomplexity:10
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf,
    map = reiterate.$.map;

  describe('Basic tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        array;

      // forward
      forOf(reiterate(a), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate([]).values(), function () {
        index += 1;
      });

      expect(index).to.be(0);

      index = 0;
      forOf(reiterate(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate(a).reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      array = reiterate(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a).values().unique().asSet(reiterate.$.Set);
      expect(array.size).to.be(b.length);
      array.forEach(function (item) {
        expect(b.indexOf(item)).to.not.be(-1);
      });

      // map
      array = reiterate(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a, function (item) {
        return String(item);
      }));

      array = reiterate(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a.slice().reverse(), function (item) {
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
        index;

      // forward
      index = 1;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index += 1;
      });

      gen = reiterate(a).keys().slice(-1);
      forOf(gen, function (entry) {
        expect(entry).to.eql(4);
      });

      gen = reiterate(a).keys().slice(1, 3);
      index = 1;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, 3);
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      gen = reiterate(a).keys().slice(1, -1).reverse();
      index = a.length - 2;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, a.length - 2);
        expect(entry).to.eql(index);
        index -= 1;
      });
    });

    it('Array filter', function () {
      var a = [1, 2, 3, 4, 5],
        index,
        counter;

      expect(function () {
        forOf(reiterate(a).filter(), function () {
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        counter = reiterate(a).filter(function (value) {
          return value >= 2 && value <= 4;
        });
      }).to.not.throwException();

      index = 2;
      forOf(counter, function (entry) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.be(index);
        index += 1;
      });
    });

    it('Array filter map', function () {
      var a = reiterate().from(65).to(90).asArray(),
        index,
        counter;

      expect(function () {
        counter = reiterate(a).filter(function (entry) {
          return entry >= 80 && entry <= 85;
        }).map(function (entry) {
          return String.fromCharCode(entry);
        });
      }).to.not.throwException();

      index = 80;
      forOf(counter, function (entry) {
        expect(index).to.be.within(80, 85);
        expect(entry).to.be(String.fromCharCode(index));
        index += 1;
      });
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
        forOf(reiterate(a).every(), function () {
          return true;
        });
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
        forOf(reiterate(a).some(), function () {
          return true;
        });
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

},{"../scripts/":9}],14:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:29,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf,
    codePointAt = reiterate.$.codePointAt,
    map = reiterate.$.map;

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
        e = map(b, function (item) {
          return codePointAt(item);
        }),
        array = reiterate(a).values().asArray(),
        string = reiterate(a).values().asString(),
        iterator = reiterate(a).values().map(function (item) {
          return codePointAt(item);
        }),
        index = 0;

      // forward
      index = 0;
      forOf(reiterate('').values(), function () {
        index += 1;
      });

      expect(index).to.be(0);

      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate(a).keys().asArray();
      expect(array).to.eql(c);
      array = reiterate(a).entries().asArray();
      expect(array).to.eql(d);
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index += 1;
      });

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
        return codePointAt(item);
      });

      index = b.length - 1;
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index -= 1;
      });
    });

    it('String chars', function () {
      var a =
        '\uD835\uDC68\uD835\uDC69\uD835\uDC6A\uD835\uDC6B\uD835\uDC6C',
        gen = reiterate(a).keys().slice(1, -3),
        index;

      // forward
      index = 2;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(2, a.length - 4);
        expect(entry).to.eql(index);
        index += 2;
      });

      gen = reiterate(a).keys().slice(-3);
      forOf(gen, function (entry) {
        expect(entry).to.eql(8);
      });

      gen = reiterate(a).keys().slice(1, 3);
      index = 2;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(2, 4);
        expect(entry).to.eql(index);
        index += 2;
      });

      // reverse
      gen = reiterate(a).keys().slice(1, -3).reverse();
      index = a.length - 4;
      forOf(gen, function (entry) {
        expect(entry).to.be.within(1, a.length - 4);
        expect(entry).to.eql(index);
        index -= 2;
      });
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

},{"../scripts/":9}],15:[function(require,module,exports){
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
    reiterate = required.subject,
    forOf = required.forOf,
    map = reiterate.$.map,
    MAX_SAFE_INTEGER = reiterate.$.MAX_SAFE_INTEGER;

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
        array;

      // forward
      forOf(reiterate(a, true), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a, true).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate(a, true).reverse(), function (entry) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate(a, true).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate(a, true).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate(a, true).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate(a, true).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d, function (item) {
        return String(item);
      }));

      array = reiterate(a, true).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d.slice().reverse(), function (item) {
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
      var gen = reiterate({
          length: 0
        }, true).entries().reverse(),
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

      gen = reiterate({
        length: MAX_SAFE_INTEGER
      }, true);
      state = gen.state();
      expect(state).to.eql({
        length: MAX_SAFE_INTEGER,
        from: 0,
        to: MAX_SAFE_INTEGER - 1,
        by: 1,
        reversed: false,
        entries: false,
        values: true,
        keys: false
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
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:17,
    maxcomplexity:5
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    forOf = required.forOf;

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
      array;

    it('Object enumerate, no length', function () {
      // forward
      index = 0;
      forOf(reiterate(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

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
      forOf(reiterate(a).own(), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).own().entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).own().values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate(a).own().keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

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

},{"../scripts/":9}],17:[function(require,module,exports){
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
    reiterate = required.subject,
    forOf = required.forOf,
    map = reiterate.$.map;

  describe('Basic static tests', function () {
    it('Array of primatives', function () {
      var a = [1, 2, 3, 5, 1, 3, 1, 2, 4],
        b = [1, 2, 3, 5, 4],
        c = [4, 2, 1, 3, 5],
        d = [1, [2], 3, [5, 1, [3]], 1, 2, [4]],
        index = 0,
        array;

      // forward
      forOf(reiterate.array(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate.array(a).reverse(), function (entry) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate.array(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate.array(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate.array(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a, function (item) {
        return String(item);
      }));

      array = reiterate.array(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(a.slice().reverse(), function (item) {
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

},{"../scripts/":9}],18:[function(require,module,exports){
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
    reiterate = required.subject,
    forOf = required.forOf,
    codePointAt = reiterate.$.codePointAt,
    map = reiterate.$.map;

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
        e = map(b, function (item) {
          return codePointAt(item);
        }),
        array = reiterate.string(a).values().asArray(),
        string = reiterate.string(a).values().asString(),
        iterator = reiterate.string(a).values().map(function (item) {
          return codePointAt(item);
        }),
        index = 0;

      // forward
      expect(string).to.be(a);
      expect(array).to.eql(b);
      array = reiterate.string(a).keys().asArray();
      expect(array).to.eql(c);
      array = reiterate.string(a).entries().asArray();
      expect(array).to.eql(d);
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index += 1;
      });

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
        return codePointAt(item);
      });

      index = b.length - 1;
      forOf(iterator, function (entry) {
        expect(entry).to.be(e[index]);
        index -= 1;
      });
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

},{"../scripts/":9}],19:[function(require,module,exports){
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
    reiterate = required.subject,
    forOf = required.forOf,
    map = reiterate.$.map;

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
        array;

      // forward
      forOf(reiterate.array(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.array(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

      // reverse
      index = a.length - 1;
      forOf(reiterate.array(a).reverse(), function (entry) {
        expect(entry).to.eql(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).entries().reverse(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).values().reverse(), function (entry) {
        expect(entry).to.be(a[index]);
        index -= 1;
      });

      index = a.length - 1;
      forOf(reiterate.array(a).keys().reverse(), function (entry) {
        expect(entry).to.eql(index);
        index -= 1;
      });

      // unique
      array = reiterate.array(a).values().unique().asArray();
      expect(array).to.eql(b);

      array = reiterate.array(a).values().reverse().unique().asArray();
      expect(array).to.eql(c);

      // map
      array = reiterate.array(a).values().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d, function (item) {
        return String(item);
      }));

      array = reiterate.array(a).values().reverse().map(function (item) {
        return String(item);
      }).asArray();

      expect(array).to.eql(map(d.slice().reverse(), function (item) {
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

},{"../scripts/":9}],20:[function(require,module,exports){
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
    reiterate = required.subject,
    forOf = required.forOf;

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
      array;

    it('Object enumerate, no length', function () {
      // forward
      index = 0;
      forOf(reiterate.enumerate(a), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

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
      forOf(reiterate.enumerate(a).own(), function (entry) {
        expect(entry).to.eql(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().entries(), function (entry) {
        expect(entry).to.eql([index, a[index]]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().values(), function (entry) {
        expect(entry).to.be(a[index]);
        index += 1;
      });

      index = 0;
      forOf(reiterate.enumerate(a).own().keys(), function (entry) {
        expect(entry).to.eql(index);
        index += 1;
      });

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
    reiterate = required.subject,
    forOf = required.forOf;

  describe('Basic tests', function () {
    it('Array then defined but not a function', function () {
      function noop() {}

      expect(function () {
        forOf(reiterate([]).then(null), function (entry) {
          noop(entry);
          return true;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('Array circular', function () {
      var a = [1];

      a.push(a);

      function noop() {}

      expect(function () {
        forOf(reiterate(a).flatten(), function (entry) {
          noop(entry);
          //break;
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
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
    it('takeWhile', function () {
      var a = [1, 2, 3, 4, 1, 2, 3, 4],
        array = reiterate(a).values().takeWhile(function (item) {
          return item < 4;
        }).asArray();

      expect(array).to.eql([1, 2, 3]);
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
    it('dropWhile', function () {
      var a = [1, 2, 3, 4, 1, 2, 3, 4],
        array = reiterate(a).values().dropWhile(function (item) {
          return item < 4;
        }).asArray();

      expect(array).to.eql([4, 1, 2, 3, 4]);
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
    it('Chunk', function () {
      var array = reiterate().to(10).chunk(3).asArray();

      expect(array).to.eql([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10]]);
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
    it('Compact', function () {
      var a = [0, 1, false, 2, '', 3, undefined, 4, null, 5, NaN, 6],
        array = reiterate(a).values().compact().asArray();

      expect(array).to.eql([1, 2, 3, 4, 5, 6]);
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

      array = reiterate(a).values().difference([4, 2]).asMap(reiterate.$.Map);
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

},{"../scripts/":9}],28:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject,
    isGeneratorSupported = required.isGeneratorSupported,
    symIt = reiterate.iterator;

  describe('Basic tests', function () {
    it('Other iterables', function () {
      var a = new reiterate.$.Map().set(0, 1).set(1, 2).set(2, 3),
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
      a = new reiterate.$.Set().add(0).add(1).add(2);
      array = reiterate(a).asArray();
      expect(array).to.eql([0, 1, 2]);

      a = {
        a: 1,
        b: 2,
        c: 3
      };

      if (isGeneratorSupported) {
        /*jshint evil:true */
        a[symIt] = new Function('return function*(){for(var key in this)' +
          'if(this.hasOwnProperty(key))yield this[key]};')();
      } else {
        a[symIt] = function () {
          var index = 0,
            iterable = this,
            keys;

          return {
            next: function () {
              var object;

              keys = keys || (function () {
                var result = [],
                  key;

                for (key in iterable) {
                  if (key !== symIt &&
                    Object.prototype.hasOwnProperty.call(iterable, key)) {
                    result.push(iterable[key]);
                  }
                }

                return result;
              }());

              if (index < keys.length) {
                object = {
                  done: false,
                  value: keys[index]
                };

                index += 1;
              } else {
                object = {
                  done: true,
                  value: undefined
                };
              }

              return object;
            }
          };
        };
      }

      array = reiterate(a).asArray();
      expect(array.sort()).to.eql([1, 2, 3]);

      if (isGeneratorSupported) {
        /*jshint evil:true */
        a[symIt] = new Function('return function*(){for(var key in this)' +
          'if(this.hasOwnProperty(key))yield key};')();
      } else {
        a[symIt] = function () {
          var index = 0,
            iterable = this,
            keys;

          return {
            next: function () {
              var object;

              keys = keys || (function () {
                var result = [],
                  key;

                for (key in iterable) {
                  if (key !== symIt &&
                      Object.prototype.hasOwnProperty.call(iterable, key)) {
                    result.push(key);
                  }
                }

                return result;
              }());

              if (index < keys.length) {
                object = {
                  done: false,
                  value: keys[index]
                };

                index += 1;
              } else {
                object = {
                  done: true,
                  value: undefined
                };
              }

              return object;
            }
          };
        };
      }

      array = reiterate(a).asArray();
      expect(array).to.eql(['a', 'b', 'c']);

      array = reiterate(a).join();
      expect(array).to.be('a,b,c');

      array = reiterate(a).asString();
      expect(array).to.be('abc');
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

      array = reiterate(a).values().initial().asMap(reiterate.$.Map);
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

      array = reiterate(a).values().rest().asMap(reiterate.$.Map);
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
      value = reiterate(a).union(b, c, d).asSet(reiterate.$.Set);
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
      value = reiterate([]).union().asSet(reiterate.$.Set);
      expect(value.size).to.be(0);
      value = reiterate([]).union([]).asSet(reiterate.$.Set);
      expect(value.size).to.be(0);
      value = reiterate([]).union([1]).asSet(reiterate.$.Set);
      expect(value.size).to.be(1);
      value = reiterate([1]).union().asSet(reiterate.$.Set);
      expect(value.size).to.be(1);
    });
  });
}());

},{"../scripts/":9}],34:[function(require,module,exports){
/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:1, maxdepth:2, maxstatements:46,
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
      array = reiterate([1, 1, 3, 2, 2])
        .values()
        .intersection(a, b)
        .asSet(reiterate.$.Set);

      expect(array.size).to.be(2);
      expect(array.has(1)).to.be(true);
      expect(array.has(2)).to.be(true);
    });
  });
}());

},{"../scripts/":9}],35:[function(require,module,exports){
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

},{"../scripts/":9}],36:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.chop', function () {
    var arr = required.create(
        undefined,
        null,
        1,
        'a',
        2,
        'b',
        null,
        undefined
      ),
      testValue;

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.chop();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.chop(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.chop(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.chop(arr)).to.eql(arr);
      expect(reiterate.$.chop(arr, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(arr, -1)).to.eql(testValue);
      expect(reiterate.$.chop(arr, -1).length).to.be(1);
      expect(reiterate.$.chop(arr, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(arr, 3)).to.eql(testValue);
      expect(reiterate.$.chop(arr, -1, 4)).to.eql([]);
      expect(reiterate.$.chop(arr, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(arr, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(arr, 3, 6)).to.eql(testValue);
    });

    it('should work with objects that have length', function () {
      var obj = required.array2Object(arr);

      expect(reiterate.$.chop(obj)).to.eql(arr);
      expect(reiterate.$.chop(obj, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(obj, -1)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1, 4)).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(testValue);
    });

    it('should work with arguments', function () {
      var obj = reiterate.$.returnArgs(
        undefined,
        null,
        1,
        'a',
        2,
        'b',
        null,
        undefined
      );

      expect(reiterate.$.chop(obj)).to.eql(arr);
      expect(reiterate.$.chop(obj, undefined, undefined)).to.eql(arr);

      testValue = required.create(undefined);
      expect(reiterate.$.chop(obj, -1)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql(arr);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql(testValue);
      expect(reiterate.$.chop(obj, -1, 4), []).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(testValue);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(testValue);
    });

    it('should work with string', function () {
      var obj = '1234567890';

      expect(reiterate.$.chop(obj)).to.eql([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);
      expect(reiterate.$.chop(obj, undefined, undefined))
        .to.eql(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

      expect(reiterate.$.chop(obj, -1)).to.eql(['0']);
      expect(reiterate.$.chop(obj, -1).length).to.be(1);
      expect(reiterate.$.chop(obj, 0)).to.eql([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);

      testValue = required.create('a', 2, 'b', null, undefined);
      expect(reiterate.$.chop(obj, 3)).to.eql([
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
      ]);
      expect(reiterate.$.chop(obj, -1, 4), []).to.eql([]);
      expect(reiterate.$.chop(obj, -1, 4).length).to.be(0);

      testValue = required.create(undefined, null, 1, 'a');
      expect(reiterate.$.chop(obj, 0, 4)).to.eql(['1', '2', '3', '4']);

      testValue = ['a', 2, 'b'];
      expect(reiterate.$.chop(obj, 3, 6)).to.eql(['4', '5', '6']);
    });
  });
}());

},{"../../scripts/":9}],37:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.every', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      everyArray = required.create(
        0,
        1,
        2,
        'a',
        'b',
        'c', [8, 9, 10], {},
        true,
        false,
        undefined,
        null,
        new Date(),
        new Error('x'),
        new RegExp('t'),
        Infinity, -Infinity
      ),
      testSubject,
      testIndex,
      expected,
      numberOfRuns;

    beforeEach(function () {
      testSubject = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        false,
        0,
        8,
        9
      );
      delete testSubject[1];
      delete testSubject[8];
      numberOfRuns = 0;
      expected = {
        0: 2,
        2: undefined,
        3: true
      };
    });

    everyArray.length = 25;
    everyArray[24] = NaN;
    everyArray[25] = 'end';

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.every();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.every(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.every(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.every(everyArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.every(everyArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.every(everyArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      var result = reiterate.$.every(
        everyArray,
        function (element, index, array) {
          expect(array).to.be(everyArray);
          expect(typeof index === 'number').to.be.ok();
          expect(index >= 0).to.be.ok();
          expect(index <= lastIndex).to.be.ok();
          if (reiterate.$.numIsNaN(element)) {
            expect(reiterate.$.numIsNaN(everyArray[index])).to.be(true);
          } else {
            expect(element).to.be(everyArray[index]);
          }

          testIndex = index;
          if (element === 'end') {
            return false;
          }

          return true;
        });

      expect(result).to.be(false);

      expect(testIndex).to.be(everyArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.every(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.every(arr, function (a) {
          i += 1;
          arr.push(a + 3);

          return i <= 3;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
        expect(i).to.be(3);
      }
    );

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.every([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it('should return true if it runs to the end', function () {
      var actual = reiterate.$.every(testSubject, function () {
        return true;
      });

      expect(actual).to.be.ok();
    });

    it('should return false if it is stopped somewhere', function () {
      var actual = reiterate.$.every(testSubject, function () {
        return false;
      });

      expect(actual).to.not.be.ok();
    });

    it('should return true if there are no elements', function () {
      var actual = reiterate.$.every([], function () {
        return true;
      });

      expect(actual).to.be.ok();
    });

    it('should stop after 3 elements', function () {
      var actual = {};

      reiterate.$.every(testSubject, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      });

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements using a context', function () {
      var actual = {},
        o = {
          a: actual
        };

      reiterate.$.every(testSubject, function (obj, index) {
        this.a[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      }, o);

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements in an array-like object', function () {
      var ts = Object(testSubject),
        actual = {};

      reiterate.$.every(ts, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return false;
        }

        return true;
      });

      expect(actual).to.eql(expected);
    });

    it(
      'should stop after 3 elements in an array-like object using a context',
      function () {
        var ts = Object(testSubject),
          actual = {},
          o = {
            a: actual
          };

        reiterate.$.every(ts, function (obj, index) {
          this.a[index] = obj;
          numberOfRuns += 1;
          if (numberOfRuns === 3) {
            return false;
          }

          return true;
        }, o);

        expect(actual).to.eql(expected);
      }
    );

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.every('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: false */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.every([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.every([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.every([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.every([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.every', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.every([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.every([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.every([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.every([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());

},{"../../scripts/":9}],38:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.filter', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      filterArray = required.create(
        0,
        1,
        2,
        'a',
        'b',
        'c', [8, 9, 10], {},
        true,
        false,
        undefined,
        null,
        new Date(),
        new Error('x'),
        new RegExp('t'),
        Infinity, -Infinity
      ),
      testSubject,
      testIndex,
      filteredArray,
      callback;

    filterArray.length = 25;
    filterArray[24] = NaN;
    filterArray[25] = 'end';

    callback = function callback(o, i) {
      /*jslint unparam: true */
      /*jshint unused: false */
      return i !== 3 && i !== 5;
    };

    beforeEach(function () {
      testSubject = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        false,
        0,
        8,
        9
      );
      delete testSubject[1];
      delete testSubject[8];
      filteredArray = required.create(2, undefined, 'hej', false, 0, 9);
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.filter();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.filter(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.filter(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.filter(filterArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.filter(filterArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.filter(filterArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.filter(
        filterArray,
        function (element, index, array) {
          expect(array).to.be(filterArray);
          expect(typeof index === 'number').to.be.ok();
          expect(index >= 0).to.be.ok();
          expect(index <= lastIndex).to.be.ok();
          if (reiterate.$.numIsNaN(element)) {
            expect(reiterate.$.numIsNaN(filterArray[index])).to.be.ok();
          } else {
            expect(element).to.be(filterArray[index]);
          }

          testIndex = index;
          if (reiterate.$.isString(element)) {
            return element;
          }

          return undefined;
        }
      ).toString()).to.be(['a', 'b', 'c', 'end'].toString());

      expect(testIndex).to.be(filterArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.filter(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.filter(arr, function (a) {
          i += 1;
          if (i <= 4) {
            arr.push(a + 3);
          }

          return true;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
        expect(i).to.be(3);
      }
    );

    it('should skip non-set values', function () {
      var passedValues = {},
        expected = {
          0: 1,
          2: 3,
          3: 4
        };

      testSubject = [1, 2, 3, 4];
      delete testSubject[1];
      reiterate.$.filter(testSubject, function (o, i) {
        passedValues[i] = o;

        return true;
      });

      expect(passedValues).to.eql(expected);
    });

    it('should pass the right context to the filter', function () {
      var passedValues = {},
        expected = {
          0: 1,
          2: 3,
          3: 4
        };

      testSubject = [1, 2, 3, 4];
      delete testSubject[1];
      reiterate.$.filter(testSubject, function (o, i) {
        this[i] = o;

        return true;
      }, passedValues);

      expect(passedValues).to.eql(expected);
    });

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.filter([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it(
      'should remove only the values for which the callback returns false',
      function () {
        expect(reiterate.$.filter(testSubject, callback)).to.eql(filteredArray);
      }
    );

    it('should leave the original array untouched', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.filter(testSubject, callback);
      expect(testSubject).to.eql(copy);
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.filter('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: false */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    it('should not be affected by same-index mutation', function () {
      var results = reiterate.$.filter(
        [1, 2, 3],
        function (value, index, array) {
          /*jslint unparam: true */
          /*jshint unused: false */
          array[index] = 'a';

          return true;
        }
      );

      expect(results).to.eql([1, 2, 3]);
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.filter([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.filter([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.filter([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.filter([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.filter', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.filter([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.filter([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.filter([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.filter([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());

},{"../../scripts/":9}],39:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.findIndex', function () {
    var list = [5, 10, 15, 20];

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.findIndex();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.findIndex(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.findIndex(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.findIndex(list);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.findIndex(list, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.findIndex(list, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should find item key by predicate', function () {
      var result = reiterate.$.findIndex(list, function (item) {
        return item === 15;
      });

      expect(result).to.be(2);
    });

    it('should return -1 when nothing matched', function () {
      var result = reiterate.$.findIndex(list, function (item) {
        return item === 'a';
      });

      expect(result).to.be(-1);
    });

    it('should receive all three parameters', function () {
      var index = reiterate.$.findIndex(list, function (value, index, arr) {
        expect(list[index]).to.be(value);
        expect(list).to.eql(arr);

        return false;
      });

      expect(index).to.be(-1);
    });

    it('should work with the context argument', function () {
      var context = {};

      reiterate.$.findIndex([1], function () {
        expect(this).to.be(context);
      }, context);
    });

    it('should work with an array-like object', function () {
      var obj = {
          0: 1,
          1: 2,
          2: 3,
          length: 3
        },
        foundIndex = reiterate.$.findIndex(obj, function (item) {
          return item === 3;
        });

      expect(foundIndex).to.be(2);
    });

    it(
      'should work with an array-like object with negative length',
      function () {
        var obj = {
            0: 1,
            1: 2,
            2: 3,
            length: -3
          },
          foundIndex = reiterate.$.findIndex(obj, function () {
            throw new Error('should not reach here');
          });

        expect(foundIndex).to.be(-1);
      }
    );

    it('should work with a sparse array', function () {
      var obj = required.create(1, 2, undefined),
        seen = [],
        foundIndex,
        expected = [];

      seen.length = 3;
      delete obj[1];
      foundIndex = reiterate.$.findIndex(obj, function (item, idx) {
        if (Object.prototype.hasOwnProperty.call(obj, idx)) {
          seen[idx] = required.create(idx, item);

          return reiterate.$.isUndefined(item);
        }

        return false;
      });

      expected.length = 3;
      expected[0] = [0, 1];
      expected[2] = required.create(2, undefined);
      expect(foundIndex).to.be(2);
      expect(seen).to.eql(expected);
    });

    it('should work with a sparse array-like object', function () {
      var obj = {
          0: 1,
          2: undefined,
          length: 3.2
        },
        seen = [],
        expected = [],
        foundIndex;

      seen.length = 3;
      foundIndex = reiterate.$.findIndex(obj, function (item, idx) {
        if (Object.prototype.hasOwnProperty.call(obj, idx)) {
          seen[idx] = required.create(idx, item);

          return reiterate.$.isUndefined(item);
        }

        return false;
      });

      expected.length = 3;
      expected[0] = [0, 1];
      expected[2] = required.create(2, undefined);
      expect(foundIndex).to.be(2);
      expect(seen).to.eql(expected);
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.findIndex([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.findIndex([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.findIndex([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.findIndex([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.findIndex', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.findIndex([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.findIndex([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());

},{"../../scripts/":9}],40:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.indexOf', function () {
    var arr = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      arr2 = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        2,
        false,
        0,
        8,
        9
      ),
      arr3 = [0, 1, 2, 3, 4, 5];

    delete arr2[1];
    delete arr2[8];
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.indexOf();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.indexOf(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.indexOf(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should find the string in array', function () {
      expect(reiterate.$.indexOf(arr, 'toString')).to.be(0);
      expect(reiterate.$.indexOf(arr, 'toLocaleString')).to.be(1);
      expect(reiterate.$.indexOf(arr, 'valueOf')).to.be(2);
      expect(reiterate.$.indexOf(arr, 'hasOwnProperty')).to.be(3);
      expect(reiterate.$.indexOf(arr, 'isPrototypeOf')).to.be(4);
      expect(reiterate.$.indexOf(arr, 'propertyIsEnumerable')).to.be(5);
      expect(reiterate.$.indexOf(arr, 'constructor')).to.be(6);
    });

    it('should not find the string in array', function () {
      expect(reiterate.$.indexOf(arr, 'foo')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'bar')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'fuz')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'push')).to.be(-1);
      expect(reiterate.$.indexOf(arr, 'pop')).to.be(-1);
    });

    it('should find the number in the array', function () {
      expect(reiterate.$.indexOf(arr3, 0)).to.be(0);
      expect(reiterate.$.indexOf(arr3, 1)).to.be(1);
      expect(reiterate.$.indexOf(arr3, 2)).to.be(2);
      expect(reiterate.$.indexOf(arr3, 3)).to.be(3);
      expect(reiterate.$.indexOf(arr3, 4)).to.be(4);
      expect(reiterate.$.indexOf(arr3, 5)).to.be(5);
    });

    it('should not find the number in the array', function () {
      expect(reiterate.$.indexOf(arr3, 6)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 7)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 8)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 9)).to.be(-1);
      expect(reiterate.$.indexOf(arr3, 10)).to.be(-1);
    });

    it('should find the element', function () {
      expect(reiterate.$.indexOf(arr2, 'hej')).to.be(4);
    });

    it('should not find the element', function () {
      expect(reiterate.$.indexOf(arr2, 'mus')).to.be(-1);
    });

    it('should find undefined as well', function () {
      expect(reiterate.$.indexOf(arr2, undefined)).to.not.be(-1);
    });

    it('should skip unset indexes', function () {
      expect(reiterate.$.indexOf(arr2, undefined)).to.be(2);
    });

    it('should use a strict test', function () {
      expect(reiterate.$.indexOf(arr2, null)).to.be(5);
      expect(reiterate.$.indexOf(arr2, '2')).to.be(-1);
    });

    it('should skip the first if fromIndex is set', function () {
      expect(reiterate.$.indexOf(arr2, 2, 2)).to.be(6);
      expect(reiterate.$.indexOf(arr2, 2, 0)).to.be(0);
      expect(reiterate.$.indexOf(arr2, 2, 6)).to.be(6);
    });

    it('should work with negative fromIndex', function () {
      expect(reiterate.$.indexOf(arr2, 2, -5)).to.be(6);
      expect(reiterate.$.indexOf(arr2, 2, -11)).to.be(0);
    });

    it('should work with fromIndex being greater than the length', function () {
      expect(reiterate.$.indexOf(arr2, 0, 20)).to.be(-1);
    });

    it(
      'should work with fromIndex being negative and greater than the length',
      function () {
        expect(reiterate.$.indexOf(arr2, 'hej', -20)).to.be(4);
      }
    );
  });
}());

},{"../../scripts/":9}],41:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;


  describe('Array.isArray', function () {
    it('missing, null and undefined', function () {
      expect(reiterate.$.isArray()).to.not.be.ok();
      expect(reiterate.$.isArray(undefined)).to.not.be.ok();
      expect(reiterate.$.isArray(null)).to.not.be.ok();
    });

    it('primitives', function () {
      expect(reiterate.$.isArray(1)).to.not.be.ok();
      expect(reiterate.$.isArray(true)).to.not.be.ok();
      expect(reiterate.$.isArray('')).to.not.be.ok();
    });

    it('array', function () {
      expect(reiterate.$.isArray([])).to.be.ok();
    });

    it('objects', function () {
      expect(reiterate.$.isArray(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.isArray(new Date())).to.not.be.ok();
      expect(reiterate.$.isArray(new RegExp('x'))).to.not.be.ok();
      expect(reiterate.$.isArray(reiterate.$.noop)).to.not.be.ok();
      expect(reiterate.$.isArray({
        0: 'a',
        length: 1
      })).to.not.be.ok();
    });

    it('arguments', function () {
      expect(reiterate.$.isArray(reiterate.$.returnArgs())).to.not.be.ok();
    });

    it('Array.prototype', function () {
      expect(reiterate.$.isArray(Array.prototype)).to.be.ok();
    });

    if (required.frame) {
      it('should work accross frames', function () {
        expect(reiterate.$.isArray(new required.frame.Array(1, 2, 3)))
          .to.be.ok();
      });
    }
  });
}());

},{"../../scripts/":9}],42:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.map', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      mapArray = required.create(
        0,
        1,
        2,
        'a',
        'b',
        'c', [8, 9, 10], {},
        true,
        false,
        undefined,
        null,
        new Date(),
        new Error('x'),
        new RegExp('t'),
        Infinity, -Infinity
      ),
      testSubject,
      testIndex,
      callback;

    mapArray.length = 25;
    mapArray[24] = NaN;
    mapArray[25] = 'end';

    beforeEach(function () {
      var i = -1;

      testSubject = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        false,
        0,
        8,
        9
      );
      delete testSubject[1];
      delete testSubject[8];
      callback = function () {
        i += 1;

        return i;
      };
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.map();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.map(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.map(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.map(mapArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.map(mapArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.map(mapArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.map(mapArray, function (element, index, array) {
        expect(array).to.be(mapArray);
        expect(typeof index === 'number').to.be.ok();
        expect(index >= 0).to.be.ok();
        expect(index <= lastIndex).to.be.ok();
        if (reiterate.$.numIsNaN(element)) {
          expect(reiterate.$.numIsNaN(mapArray[index])).to.be(true);
        } else {
          expect(element).to.be(mapArray[index]);
        }

        testIndex = index;

        return element;
      }).toString()).to.be(mapArray.toString());

      expect(testIndex).to.be(mapArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.map(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it('should set the context correctly', function () {
      var context = {};

      reiterate.$.map(testSubject, function (o, i) {
        this[i] = o;
      }, context);

      expect(context).to.eql(testSubject);
    });

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.map([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it('should not change the array it is called on', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.map(testSubject, callback);
      expect(testSubject).to.eql(copy);
    });

    it(
      'should only run for the number of objects in the array when it started',
      function () {
        var arr1 = [1, 2, 3, 4, 5],
          arr2 = [1, 2, 3, 4, 5, 4, 5, 6, 8],
          i = 0;

        delete arr1[3];
        delete arr2[3];
        reiterate.$.map(arr1, function (o) {
          arr1.push(o + 3);
          i += 1;

          return o;
        });

        expect(arr1).to.eql(arr2);
        expect(i).to.be(4);
      }
    );

    it(
      'should properly translate the values as according to the callback',
      function () {
        var result = reiterate.$.map(testSubject, callback),
          expected = [0, 0, 1, 2, 3, 4, 5, 6, 'a', 7];

        delete expected[1];
        delete expected[8];
        expect(result).to.eql(expected);
      }
    );

    it('should skip non-existing values', function () {
      var array = [1, 2, 3, 4, 5, 6],
        i = 0;

      delete array[2];
      delete array[5];
      reiterate.$.map(array, function () {
        i += 1;
      });

      expect(i).to.be(4);
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.map('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: true */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    if (required.isStrictMode()) {
      it('does not autobox the content in strict mode', function () {
        var actual;

        reiterate.$.map([1], function () {
          actual = this;
        }, 'x');

        expect(typeof actual).to.be('string');

        reiterate.$.map([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.map([1], function () {
          actual = this;
        }, undefined);

        expect(actual).to.be(undefined);

        reiterate.$.map([1], function () {
          actual = this;
        }, null);

        expect(actual).to.be(null);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.map', function () {
    it('does autobox the content in non-strict mode', function () {
      var actual;

      reiterate.$.map([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual).to.be('object');

      reiterate.$.map([1], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);

      reiterate.$.map([1], function () {
        actual = this;
      }, undefined);

      expect(actual).to.be(required.global);

      reiterate.$.map([1], function () {
        actual = this;
      }, null);

      expect(actual).to.be(required.global);
    });
  });
}());

},{"../../scripts/":9}],43:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.push', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.push();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.push(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.push(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('array', function () {
      var arrCmp = required.create(
          undefined,
          null, -1,
          0,
          1,
          false,
          true,
          undefined,
          '',
          'abc',
          null,
          undefined
        ),
        arr = [],
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });

    it('arguments', function () {
      var arrCmp = required.create(
          undefined,
          null, -1,
          0,
          1,
          false,
          true,
          undefined,
          '',
          'abc',
          null,
          undefined
        ),
        arr = reiterate.$.returnArgs(),
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(reiterate.$.chop(arr)).to.eql(arrCmp);
    });

    it('object with length', function () {
      var arrCmp = {
          0: undefined,
          1: null,
          2: -1,
          3: 0,
          4: 1,
          5: false,
          6: true,
          7: undefined,
          8: '',
          9: 'abc',
          10: null,
          11: undefined,
          length: 12
        },
        arr = {
          length: 0
        },
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });

    it('object without length', function () {
      var arrCmp = {
          0: undefined,
          1: null,
          2: -1,
          3: 0,
          4: 1,
          5: false,
          6: true,
          7: undefined,
          8: '',
          9: 'abc',
          10: null,
          11: undefined,
          length: 12
        },
        arr = {},
        i;

      expect(reiterate.$.push(arr, undefined)).to.be(1);
      expect(reiterate.$.push(arr, null)).to.be(2);
      expect(reiterate.$.push(arr, -1)).to.be(3);
      expect(reiterate.$.push(arr, 0)).to.be(4);
      expect(reiterate.$.push(arr, 1)).to.be(5);
      expect(reiterate.$.push(arr, false)).to.be(6);
      expect(reiterate.$.push(arr, true)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr)).to.be(7);
      expect(reiterate.$.push(arr, undefined)).to.be(8);
      expect(reiterate.$.push(arr, '')).to.be(9);
      expect(reiterate.$.push(arr, 'abc')).to.be(10);
      expect(reiterate.$.push(arr, null)).to.be(11);
      expect(reiterate.$.push(arr, undefined)).to.be(12);
      expect(arr.length).to.be(arrCmp.length);
      for (i = 0; i < arr.length; i += 1) {
        expect(Object.prototype.hasOwnProperty.call(arr, i)).to.be.ok();
        expect(arr[i]).to.be(arrCmp[i]);
      }

      expect(arr).to.eql(arrCmp);
    });
  });
}());

},{"../../scripts/":9}],44:[function(require,module,exports){
/*jslint maxlen:80, es6:false, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.reduce', function () {
    var testSubject;

    beforeEach(function () {
      testSubject = [1, 2, 3];
    });

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.reduce();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.reduce(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.reduce(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.reduce([]);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.reduce([], undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.reduce([], null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.reduce(array, function (prev, item, index, list) {
        expect(prev).to.be('');
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      }, '');
    });

    it('should start with the right initialValue', function () {
      var array = ['1'];

      reiterate.$.reduce(array, function (prev, item, index, list) {
        expect(prev).to.be(10);
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      }, 10);
    });


    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.reduce(arr, function (a, b) {
          i += 1;
          if (i <= 4) {
            arr.push(a + 3);
          }

          return b;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5]);
        expect(i).to.be(2);
      }
    );

    it('should work as expected for empty arrays', function () {
      expect(function () {
        reiterate.$.reduce([], function () {
          throw new Error('function should not be called!');
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should return the expected result', function () {
      expect(reiterate.$.reduce(testSubject, function (a, b) {
        return String(a || '') + String(b || '');
      })).to.eql(testSubject.join(''));
    });

    it('should not directly affect the passed array', function () {
      var copy = reiterate.$.chop(testSubject);

      reiterate.$.reduce(testSubject, function (a, b) {
        return a + b;
      });

      expect(testSubject).to.eql(copy);
    });

    it('should skip non-set values', function () {
      delete testSubject[1];
      var visited = {};

      reiterate.$.reduce(testSubject, function (a, b) {
        if (a) {
          visited[a] = true;
        }

        if (b) {
          visited[b] = true;
        }

        return 0;
      });

      expect(visited).to.eql({
        1: true,
        3: true
      });
    });

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.reduce('foo', function (previous, item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: true */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    if (required.isStrictMode()) {
      it('has the correct context ins strict mode', function () {
        var actual;

        reiterate.$.reduce([1], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);

        reiterate.$.reduce([1, 2], function () {
          actual = this;
        });

        expect(actual).to.be(undefined);
      });
    }
  });
}());

/*jslint sloppy: true */
(function () {
  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.reduce', function () {
    it('has the correct context in non-strict mode', function () {
      var actual;

      reiterate.$.reduce([1], function () {
        actual = this;
      });

      expect(actual).to.be(undefined);

      reiterate.$.reduce([1, 2], function () {
        actual = this;
      });

      expect(actual).to.be(required.global);
    });
  });
}());

},{"../../scripts/":9}],45:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it, beforeEach */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Array.some', function () {
    var lastIndex = Math.pow(2, 32) - 1,
      someArray = required.create(
        0,
        1,
        2,
        'a',
        'b',
        'c', [8, 9, 10], {},
        true,
        false,
        undefined,
        null,
        new Date(),
        new Error('x'),
        new RegExp('t'),
        Infinity, -Infinity
      ),
      testSubject,
      testIndex,
      expected,
      numberOfRuns;

    beforeEach(function () {
      testSubject = required.create(
        2,
        3,
        undefined,
        true,
        'hej',
        null,
        false,
        0,
        8,
        9
      );
      delete testSubject[1];
      delete testSubject[8];
      numberOfRuns = 0;
      expected = {
        0: 2,
        2: undefined,
        3: true
      };
    });

    someArray.length = 25;
    someArray[24] = NaN;
    someArray[25] = 'end';

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.some();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.some(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.some(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if function argument is not a function', function () {
      expect(function () {
        reiterate.$.some(someArray);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.some(someArray, undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.some(someArray, null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(reiterate.$.some(someArray, function (element, index, array) {
        expect(array).to.be(someArray);
        expect(typeof index === 'number').to.be.ok();
        expect(index >= 0).to.be.ok();
        expect(index <= lastIndex).to.be.ok();
        if (reiterate.$.numIsNaN(element)) {
          expect(reiterate.$.numIsNaN(someArray[index])).to.be(true);
        } else {
          expect(element).to.be(someArray[index]);
        }

        testIndex = index;
        if (element === 'end') {
          return true;
        }

        return false;
      })).to.be(true);

      expect(testIndex).to.be(someArray.length - 1);
    });

    it('should pass the right parameters', function () {
      var array = ['1'];

      reiterate.$.some(array, function (item, index, list) {
        expect(item).to.be('1');
        expect(index).to.be(0);
        expect(list).to.be(array);
      });
    });

    it(
      'should not affect elements added to the array after it has begun',
      function () {
        var arr = [1, 2, 3],
          i = 0;

        reiterate.$.some(arr, function (a) {
          i += 1;
          arr.push(a + 3);

          return i === 3;
        });

        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
        expect(i).to.be(3);
      }
    );

    it('should set the right context when given none', function () {
      var context;

      reiterate.$.some([1], function () {
        context = this;
      });

      expect(context).to.be((function () {
        return function () {
          return this;
        };
      }()).call());
    });

    it('should return false if it runs to the end', function () {
      var actual = reiterate.$.some(testSubject, function () {
        return;
      });

      expect(actual).to.not.be.ok();
    });

    it('should return true if it is stopped somewhere', function () {
      var actual = reiterate.$.some(testSubject, function () {
        return true;
      });

      expect(actual).to.be.ok();
    });

    it('should return false if there are no elements', function () {
      var actual = reiterate.$.some([], function () {
        return true;
      });

      expect(actual).to.not.be.ok();
    });

    it('should stop after 3 elements', function () {
      var actual = {};

      reiterate.$.some(testSubject, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return true;
        }

        return false;
      });

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements using a context', function () {
      var actual = {},
        o = {
          a: actual
        };

      reiterate.$.some(testSubject, function (obj, index) {
        this.a[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return true;
        }

        return false;
      }, o);

      expect(actual).to.eql(expected);
    });

    it('should stop after 3 elements in an array-like object', function () {
      var ts = required.array2Object(testSubject),
        actual = {};

      reiterate.$.some(ts, function (obj, index) {
        actual[index] = obj;
        numberOfRuns += 1;
        if (numberOfRuns === 3) {
          return true;
        }

        return false;
      });

      expect(actual).to.eql(expected);
    });

    it(
      'should stop after 3 elements in an array-like object using a context',
      function () {
        var ts = required.array2Object(testSubject),
          actual = {},
          o = {
            a: actual
          };

        reiterate.$.some(ts, function (obj, index) {
          this.a[index] = obj;
          numberOfRuns += 1;
          if (numberOfRuns === 3) {
            return true;
          }

          return false;
        }, o);

        expect(actual).to.eql(expected);
      }
    );

    it('should have a boxed object as list argument of callback', function () {
      var actual;

      reiterate.$.some('foo', function (item, index, list) {
        /*jslint unparam: true */
        /*jshint unused: true */
        actual = list;
      });

      expect(typeof actual).to.be('object');
      expect(required.toStringTag(actual)).to.be('[object String]');
      expect(String(actual)).to.be('foo');
      expect(actual.charAt(0)).to.be('f');
    });

    it('does not autobox the content in strict mode', function () {
      var actual;

      reiterate.$.some([1], function () {
        actual = this;
      }, 'x');

      expect(typeof actual)
        .to.be(required.isStrictMode() ? 'string' : 'object');
    });
  });
}());

},{"../../scripts/":9}],46:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Date.isDate', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isDate(new RegExp('test'))).to.not.be.ok();
      expect(reiterate.$.isDate(new Date())).to.be.ok();
      expect(reiterate.$.isDate(/test/)).to.not.be.ok();
      expect(reiterate.$.isDate([])).to.not.be.ok();
      expect(reiterate.$.isDate({})).to.not.be.ok();
      expect(reiterate.$.isDate('')).to.not.be.ok();
      expect(reiterate.$.isDate(1)).to.not.be.ok();
      expect(reiterate.$.isDate(true)).to.not.be.ok();
      expect(reiterate.$.isDate()).to.not.be.ok();
      expect(reiterate.$.isDate(null)).to.not.be.ok();
      expect(reiterate.$.isDate(reiterate.$.noop)).to.not.be.ok();
      expect(reiterate.$.isDate(reiterate.$.returnArgs())).to.not.be.ok();
      expect(reiterate.$.isDate(Date.prototype)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],47:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Function.isFunction', function () {
    it('non functions should be not ok in each case', function () {
      expect(reiterate.$.isFunction()).to.not.be.ok();
      expect(reiterate.$.isFunction(undefined)).to.not.be.ok();
      expect(reiterate.$.isFunction(null)).to.not.be.ok();
      expect(reiterate.$.isFunction(1)).to.not.be.ok();
      expect(reiterate.$.isFunction(true)).to.not.be.ok();
      expect(reiterate.$.isFunction('')).to.not.be.ok();
      expect(reiterate.$.isFunction(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.isFunction(new Date())).to.not.be.ok();
      expect(reiterate.$.isFunction(new RegExp('x'))).to.not.be.ok();
      expect(reiterate.$.isFunction([])).to.not.be.ok();
      expect(reiterate.$.isFunction({})).to.not.be.ok();
      expect(reiterate.$.isFunction(reiterate.$.returnArgs())).to.not.be.ok();
      expect(reiterate.$.isFunction(Function.prototype)).to.be.ok();
    });

    it('user functions should not ok in each case', function () {
      expect(reiterate.$.isFunction(reiterate.$.noop)).to.be.ok();
      expect(reiterate.$.isFunction(describe)).to.be.ok();
      expect(reiterate.$.isFunction(expect)).to.be.ok();
      expect(reiterate.$.isFunction(it)).to.be.ok();
    });

    it('Error constructor should be ok', function () {
      expect(reiterate.$.isFunction(Error)).to.be.ok();
    });

    it('Date constructor should be ok', function () {
      expect(reiterate.$.isFunction(Date)).to.be.ok();
    });

    it('RegExp constructor should be ok', function () {
      expect(reiterate.$.isFunction(RegExp)).to.be.ok();
    });

    it('Function constructor should be ok', function () {
      expect(reiterate.$.isFunction(Function)).to.be.ok();
    });

    it('Boolean constructor should be ok', function () {
      expect(reiterate.$.isFunction(Boolean)).to.be.ok();
    });

    it('Number constructor should be ok', function () {
      expect(reiterate.$.isFunction(Number)).to.be.ok();
    });

    it('String constructor should be ok', function () {
      expect(reiterate.$.isFunction(String)).to.be.ok();
    });

    it('Object constructor should be ok', function () {
      expect(reiterate.$.isFunction(Object)).to.be.ok();
    });

    it('isNaN should be ok', function () {
      expect(reiterate.$.isFunction(isNaN)).to.be.ok();
    });

    it('isFinite should be ok', function () {
      expect(reiterate.$.isFunction(isFinite)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],48:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Function.noop', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.noop()).to.be(undefined);
      expect(reiterate.$.noop(1, 2, 3)).to.be(undefined);
      expect(reiterate.$.isFunction(reiterate.$.noop)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],49:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Function.returnArgs', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.chop(reiterate.$.returnArgs())).to.eql([]);
      expect(reiterate.$.chop(reiterate.$.returnArgs(1, 2, 3))).to.eql([1, 2, 3]);
      expect(reiterate.$.chop(reiterate.$.returnArgs(reiterate.$.noop)))
        .to.eql([reiterate.$.noop]);
    });
  });
}());

},{"../../scripts/":9}],50:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Math.sign', function () {
    it('should not throw an error in each case', function () {
      var x = reiterate.$.sign();

      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign(undefined);
      expect(reiterate.$.numIsNaN(reiterate.$.sign(undefined))).to.be.ok();
      x = reiterate.$.sign(null);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();

      expect(reiterate.$.sign(-1)).to.be(-1);

      x = reiterate.$.sign(+0);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign('0');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign('+0');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(-0);
      expect(typeof x === 'number' && x === 0 && 1 / x === -Infinity)
        .to.be.ok();
      x = reiterate.$.sign('-0');
      expect(typeof x === 'number' && x === 0 && 1 / x === -Infinity)
        .to.be.ok();

      expect(reiterate.$.sign(1)).to.be(1);
      expect(reiterate.$.sign(Infinity)).to.be(1);
      expect(reiterate.$.sign(-Infinity)).to.be(-1);

      x = reiterate.$.sign(NaN);
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign('NaN');
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign('');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(' ');
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();

      expect(reiterate.$.sign(true)).to.be(1);

      x = reiterate.$.sign(false);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(reiterate.$.noop);
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign({});
      expect(reiterate.$.numIsNaN(x)).to.be.ok();
      x = reiterate.$.sign([]);
      expect(typeof x === 'number' && x === 0 && 1 / x === Infinity).to.be.ok();
      x = reiterate.$.sign(new RegExp('c'));
      expect(reiterate.$.numIsNaN(x)).to.be.ok();

      expect(reiterate.$.sign(new Date(2013, 11, 11))).to.be(1);

      x = reiterate.$.sign(new Error('x'));
      expect(reiterate.$.numIsNaN(x)).to.be.ok();

      // we also verify that [[toNumber]] is being called
      reiterate.$.forEach([Infinity, 1], function (value) {
        expect(reiterate.$.sign(value)).to.be(1);
        expect(reiterate.$.sign(value.toString())).to.be(1);
      });

      expect(reiterate.$.sign(true)).to.be(1);
      reiterate.$.forEach([-Infinity, -1], function (value) {
        expect(reiterate.$.sign(value)).to.be(-1);
        expect(reiterate.$.sign(value.toString())).to.be(-1);
      });
    });
  });
}());

},{"../../scripts/":9}],51:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Number.isFinite', function () {
    it('should not throw an error in each case', function () {
      var zero = 0;

      expect(reiterate.$.numIsFinite()).to.not.be.ok();
      expect(reiterate.$.numIsFinite(undefined)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(null)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(1)).to.be.ok();
      expect(reiterate.$.numIsFinite(Infinity)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(-Infinity)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(NaN)).to.not.be.ok();
      expect(reiterate.$.numIsFinite('')).to.not.be.ok();
      expect(reiterate.$.numIsFinite(true)).to.not.be.ok();
      expect(reiterate.$.numIsFinite(false)).to.not.be.ok();
      expect(reiterate.$.numIsFinite({})).to.not.be.ok();
      expect(reiterate.$.numIsFinite([])).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new Date(2013, 11, 11))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.numIsFinite(4)).to.be.ok();
      expect(reiterate.$.numIsFinite(4.5)).to.be.ok();
      expect(reiterate.$.numIsFinite('hi')).to.not.be.ok();
      expect(reiterate.$.numIsFinite('1.3')).to.not.be.ok();
      expect(reiterate.$.numIsFinite('51')).to.not.be.ok();
      expect(reiterate.$.numIsFinite(0)).to.be.ok();
      expect(reiterate.$.numIsFinite(-0)).to.be.ok();
      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          return 3;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          return zero / zero;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        toString: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.numIsFinite({
        valueOf: function () {
          throw 17;
        },
        toString: function () {
          throw 42;
        }
      })).to.not.be.ok();
    });
  });
}());

},{"../../scripts/":9}],52:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Number.isInteger', function () {
    it('should be truthy on integers', function () {
      expect(reiterate.$.isInteger(4)).to.be.ok();
      expect(reiterate.$.isInteger(4.0)).to.be.ok();
      expect(reiterate.$.isInteger(reiterate.$.MAX_SAFE_INTEGER)).to.be.ok();
      expect(reiterate.$.isInteger(reiterate.$.MIN_SAFE_INTEGER)).to.be.ok();
    });

    it('should be falsy on non-integers', function () {
      var zero = 0;

      expect(reiterate.$.isInteger()).to.not.be.ok();
      expect(reiterate.$.isInteger(undefined)).to.not.be.ok();
      expect(reiterate.$.isInteger(null)).to.not.be.ok();
      expect(reiterate.$.isInteger(4.2)).to.not.be.ok();
      expect(reiterate.$.isInteger(Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(-Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(NaN)).to.not.be.ok();
      expect(reiterate.$.isInteger(true)).to.not.be.ok();
      expect(reiterate.$.isInteger(false)).to.not.be.ok();
      expect(reiterate.$.isInteger('str')).to.not.be.ok();
      expect(reiterate.$.isInteger('')).to.not.be.ok();
      expect(reiterate.$.isInteger({})).to.not.be.ok();

      expect(reiterate.$.isInteger(-10.123)).to.not.be.ok();
      expect(reiterate.$.isInteger(0)).to.be.ok();
      expect(reiterate.$.isInteger(0.123)).to.not.be.ok();
      expect(reiterate.$.isInteger(10)).to.be.ok();
      expect(reiterate.$.isInteger(10.123)).to.not.be.ok();
      expect(reiterate.$.isInteger([])).to.not.be.ok();
      expect(reiterate.$.isInteger([10.123])).to.not.be.ok();
      expect(reiterate.$.isInteger(new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.isInteger(new Error('x'))).to.not.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.isInteger(10.)).to.be.ok();
      /*jshint +W047 */
      expect(reiterate.$.isInteger(10.0)).to.be.ok();
      expect(reiterate.$.isInteger('10.')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.')).to.not.be.ok();
      expect(reiterate.$.isInteger('10. ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10. ')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.0')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.0')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.0 ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.0 ')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.123')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.123')).to.not.be.ok();
      expect(reiterate.$.isInteger('10.123 ')).to.not.be.ok();
      expect(reiterate.$.isInteger(' 10.123 ')).to.not.be.ok();

      expect(reiterate.$.isInteger('-1')).to.not.be.ok();
      expect(reiterate.$.isInteger('0')).to.not.be.ok();
      expect(reiterate.$.isInteger('1')).to.not.be.ok();
      expect(reiterate.$.isInteger('-1.')).to.not.be.ok();
      expect(reiterate.$.isInteger('0.')).to.not.be.ok();
      expect(reiterate.$.isInteger('1.')).to.not.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.isInteger(-1.)).to.be.ok();
      expect(reiterate.$.isInteger(0.)).to.be.ok();
      expect(reiterate.$.isInteger(1.)).to.be.ok();
      /*jshint +W047 */
      expect(reiterate.$.isInteger(new Date(2013, 11, 11))).to.not.be.ok();
      expect(reiterate.$.isInteger(new Date(2013, 11, 11).getTime()))
        .to.be.ok();
      expect(reiterate.$.isInteger('NaN')).to.not.be.ok();
      expect(reiterate.$.isInteger('Infinity')).to.not.be.ok();
      expect(reiterate.$.isInteger('-Infinity')).to.not.be.ok();
      expect(reiterate.$.isInteger([])).to.not.be.ok();
      expect(reiterate.$.isInteger([1])).to.not.be.ok();
      expect(reiterate.$.isInteger([1.1])).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          return 3;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          return zero / zero;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        toString: function () {
          throw 17;
        }
      })).to.not.be.ok();

      expect(reiterate.$.isInteger({
        valueOf: function () {
          throw 17;
        },
        toString: function () {
          throw 42;
        }
      })).to.not.be.ok();
    });

    it('should be false when the type is not number', function () {
      var nonNumbers = [
        false,
        true,
        null,
        undefined,
        '',
        reiterate.$.noop, {
          valueOf: function () {
            return 3;
          }
        },
        new RegExp('a', 'g'), {}
      ];

      reiterate.$.forEach(nonNumbers, function (thing) {
        expect(reiterate.$.isInteger(thing)).to.not.be.ok();
      });
    });

    it('should be false when NaN', function () {
      expect(reiterate.$.isInteger(NaN)).to.not.be.ok();
    });

    it('should be false when Infinity', function () {
      expect(reiterate.$.isInteger(Infinity)).to.not.be.ok();
      expect(reiterate.$.isInteger(-Infinity)).to.not.be.ok();
    });

    it('should be false when number is not integer', function () {
      expect(reiterate.$.isInteger(3.4)).to.not.be.ok();
      expect(reiterate.$.isInteger(-3.4)).to.not.be.ok();
    });

    it('should be true when abs(number) is 2^53 or larger', function () {
      expect(reiterate.$.isInteger(Math.pow(2, 53))).to.be.ok();
      expect(reiterate.$.isInteger(-Math.pow(2, 53))).to.be.ok();
    });

    it('should be true when abs(number) is less than 2^53', function () {
      var safeIntegers = [0, 1, Math.pow(2, 53) - 1];

      reiterate.$.forEach(safeIntegers, function (safeInt) {
        expect(reiterate.$.isInteger(safeInt)).to.be.ok();
        expect(reiterate.$.isInteger(-safeInt)).to.be.ok();
      });
    });
  });
}());

},{"../../scripts/":9}],53:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Number.isNaN', function () {
    var toObj = Object;

    it('NaN should be be true', function () {
      expect(reiterate.$.numIsNaN(NaN)).to.be(true);
    });

    it('Object(NaN) should be false', function () {
      expect(reiterate.$.numIsNaN(toObj(NaN))).to.be(false);
    });

    it('No arguments, undefined and null should be false', function () {
      expect(reiterate.$.numIsNaN()).to.be(false);
      expect(reiterate.$.numIsNaN(undefined)).to.be(false);
      expect(reiterate.$.numIsNaN(null)).to.be(false);
    });

    it('Other numbers should be false', function () {
      expect(reiterate.$.numIsNaN(Infinity)).to.be(false);
      expect(reiterate.$.numIsNaN(-Infinity)).to.be(false);
      expect(reiterate.$.numIsNaN(0)).to.be(false);
      expect(reiterate.$.numIsNaN(-0)).to.be(false);
      expect(reiterate.$.numIsNaN(-4)).to.be(false);
      expect(reiterate.$.numIsNaN(4)).to.be(false);
      expect(reiterate.$.numIsNaN(4.5)).to.be(false);
      expect(reiterate.$.numIsNaN(required.MAX_VALUE)).to.be(false);
      expect(reiterate.$.numIsNaN(required.MIN_VALUE)).to.be(false);
    });

    it('Strings should be false', function () {
      expect(reiterate.$.numIsNaN('')).to.be(false);
      expect(reiterate.$.numIsNaN('hi')).to.be(false);
      expect(reiterate.$.numIsNaN('1.3')).to.be(false);
      expect(reiterate.$.numIsNaN('51')).to.be(false);
    });

    it('Booleans should be false', function () {
      expect(reiterate.$.numIsNaN(true)).to.be(false);
      expect(reiterate.$.numIsNaN(false)).to.be(false);
    });

    it('Functions should be false', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.noop)).to.be(false);
    });

    it('Objects should be false', function () {
      expect(reiterate.$.numIsNaN({})).to.be(false);
      expect(reiterate.$.numIsNaN([])).to.be(false);
      expect(reiterate.$.numIsNaN(new RegExp('c'))).to.be(false);
      expect(reiterate.$.numIsNaN(new Date(2013, 11, 11))).to.be(false);
      expect(reiterate.$.numIsNaN(new Error('x'))).to.be(false);
    });

    it('Others should be false', function () {
      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          return 3;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          return Infinity;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          throw 17;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        toString: function () {
          throw 17;
        }
      })).to.be(false);

      expect(reiterate.$.numIsNaN({
        valueOf: function () {
          throw 17;
        },

        toString: function () {
          throw 42;
        }
      })).to.be(false);
    });
  });
}());

},{"../../scripts/":9}],54:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Number.toInteger', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toInteger({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toInteger({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toInteger({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.toInteger()).to.be(0);
      expect(reiterate.$.toInteger(undefined)).to.be(0);
      expect(reiterate.$.toInteger(null)).to.be(0);
    });

    it('number', function () {
      expect(reiterate.$.toInteger(-10.123)).to.be(-10);
      expect(reiterate.$.toInteger(0)).to.be(0);
      expect(reiterate.$.toInteger(0.123)).to.be(0);
      expect(reiterate.$.toInteger(10)).to.be(10);
      expect(reiterate.$.toInteger(10.123)).to.be(10);
      expect(reiterate.$.toInteger(Infinity)).to.be(Infinity);
      expect(reiterate.$.toInteger(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.toInteger(NaN)).to.be(0);
    });

    it('string', function () {
      expect(reiterate.$.toInteger('')).to.be(0);
      expect(reiterate.$.toInteger(' ')).to.be(0);
      expect(reiterate.$.toInteger('x')).to.be(0);
    });

    it('boolean', function () {
      expect(reiterate.$.toInteger(true)).to.be(1);
      expect(reiterate.$.toInteger(false)).to.be(0);
    });

    it('mixed objects', function () {
      expect(reiterate.$.toInteger({})).to.be(0);
      expect(reiterate.$.toInteger([])).to.be(0);
      expect(reiterate.$.toInteger([10.123])).to.be(10);
      expect(reiterate.$.toInteger(new RegExp('c'))).to.be(0);
      expect(reiterate.$.toInteger(new Error('x'))).to.be(0);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toInteger(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toInteger(10.0)).to.be(10);
      expect(reiterate.$.toInteger('10.')).to.be(10);
      expect(reiterate.$.toInteger(' 10.')).to.be(10);
      expect(reiterate.$.toInteger('10. ')).to.be(10);
      expect(reiterate.$.toInteger(' 10. ')).to.be(10);
      expect(reiterate.$.toInteger('10.0')).to.be(10);
      expect(reiterate.$.toInteger(' 10.0')).to.be(10);
      expect(reiterate.$.toInteger('10.0 ')).to.be(10);
      expect(reiterate.$.toInteger(' 10.0 ')).to.be(10);
      expect(reiterate.$.toInteger('10.123')).to.be(10);
      expect(reiterate.$.toInteger(' 10.123')).to.be(10);
      expect(reiterate.$.toInteger('10.123 ')).to.be(10);
      expect(reiterate.$.toInteger(' 10.123 ')).to.be(10);
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toInteger('-1')).to.be(-1);
      expect(reiterate.$.toInteger('0')).to.be(0);
      expect(reiterate.$.toInteger('1')).to.be(1);
      expect(reiterate.$.toInteger('-1.')).to.be(-1);
      expect(reiterate.$.toInteger('0.')).to.be(0);
      expect(reiterate.$.toInteger('1.')).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toInteger(-1.)).to.be(-1);
      expect(reiterate.$.toInteger(0.)).to.be(0);
      expect(reiterate.$.toInteger(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toInteger('-1.1')).to.be(-1);
      expect(reiterate.$.toInteger('0.1')).to.be(0);
      expect(reiterate.$.toInteger('1.1')).to.be(1);
    });

    it('date', function () {
      var dateInt;

      expect(function () {
        dateInt = reiterate.$.toInteger(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof dateInt === 'number').to.be.ok();
      expect(reiterate.$.numIsNaN(dateInt)).to.not.be.ok();
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.toInteger('NaN')).to.be(0);
      expect(reiterate.$.toInteger('Infinity')).to.be(Infinity);
      expect(reiterate.$.toInteger('-Infinity')).to.be(-Infinity);
    });

    it('array', function () {
      expect(reiterate.$.toInteger([])).to.be(0);
      expect(reiterate.$.toInteger([1])).to.be(1);
      expect(reiterate.$.toInteger([1.1])).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toInteger([1.])).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toInteger([''])).to.be(0);
      expect(reiterate.$.toInteger(['1'])).to.be(1);
      expect(reiterate.$.toInteger(['1.1'])).to.be(1);
    });

    it('object', function () {
      expect(reiterate.$.toInteger({})).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: ''
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: '1'
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: 1
      })).to.be(0);
      expect(reiterate.$.toInteger({
        valueOf: 1.1
      })).to.be(0);
      /*jshint -W047 */
      expect(reiterate.$.toInteger({
        valueOf: 1.
      })).to.be(0);
      /*jshint +W047 */
    });

    it('function', function () {
      expect(reiterate.$.toInteger(function () {
        return 1;
      })).to.be(0);
    });
  });
}());

},{"../../scripts/":9}],55:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.reiterate.$.requireObjectCoercible', function () {
    it('should not throw an error in each case', function () {
      expect(function () {
        reiterate.$.requireObjectCoercible();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(-1);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(0);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(1);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(NaN);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(Infinity);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(-Infinity);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(true);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(false);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible('');
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible('x');
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(reiterate.$.noop);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(new RegExp('y'));
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(new Date());
      }).to.not.throwException();
    });
  });
}());

},{"../../scripts/":9}],56:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.toNumber', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toNumber({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toNumber({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toNumber({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber())).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(undefined))).to.be.ok();
      expect(reiterate.$.toNumber(null)).to.be(0);
    });

    it('number', function () {
      expect(reiterate.$.toNumber(-10.123)).to.be(-10.123);
      expect(reiterate.$.toNumber(0)).to.be(0);
      expect(reiterate.$.toNumber(0.123)).to.be(0.123);
      expect(reiterate.$.toNumber(10)).to.be(10);
      expect(reiterate.$.toNumber(10.123)).to.be(10.123);
      expect(reiterate.$.toNumber(Infinity)).to.be(Infinity);
      expect(reiterate.$.toNumber(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(NaN))).to.be.ok();
    });

    it('string', function () {
      expect(reiterate.$.toNumber('')).to.be(0);
      expect(reiterate.$.toNumber(' ')).to.be(0);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber('x'))).to.be.ok();
    });

    it('boolean', function () {
      expect(reiterate.$.toNumber(true)).to.be(1);
      expect(reiterate.$.toNumber(false)).to.be(0);
    });

    it('mixed objects', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({}))).to.be.ok();
      expect(reiterate.$.toNumber([])).to.be(0);
      expect(reiterate.$.toNumber([10.123])).to.be(10.123);
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(new RegExp('c')))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(new Error('x')))).to.be.ok();
      expect(reiterate.$.toNumber(new Date(123456789))).to.be(123456789);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toNumber(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toNumber(10.0)).to.be(10);
      expect(reiterate.$.toNumber('10.')).to.be(10);
      expect(reiterate.$.toNumber(' 10.')).to.be(10);
      expect(reiterate.$.toNumber('10. ')).to.be(10);
      expect(reiterate.$.toNumber(' 10. ')).to.be(10);
      expect(reiterate.$.toNumber('10.0')).to.be(10);
      expect(reiterate.$.toNumber(' 10.0')).to.be(10);
      expect(reiterate.$.toNumber('10.0 ')).to.be(10);
      expect(reiterate.$.toNumber(' 10.0 ')).to.be(10);
      expect(reiterate.$.toNumber('10.123')).to.be(10.123);
      expect(reiterate.$.toNumber(' 10.123')).to.be(10.123);
      expect(reiterate.$.toNumber('10.123 ')).to.be(10.123);
      expect(reiterate.$.toNumber(' 10.123 ')).to.be(10.123);
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toNumber('-1')).to.be(-1);
      expect(reiterate.$.toNumber('0')).to.be(0);
      expect(reiterate.$.toNumber('1')).to.be(1);
      expect(reiterate.$.toNumber('-1.')).to.be(-1);
      expect(reiterate.$.toNumber('0.')).to.be(0);
      expect(reiterate.$.toNumber('1.')).to.be(1);
      /*jshint -W047 */
      expect(reiterate.$.toNumber(-1.)).to.be(-1);
      expect(reiterate.$.toNumber(0.)).to.be(0);
      expect(reiterate.$.toNumber(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toNumber('-1.1')).to.be(-1.1);
      expect(reiterate.$.toNumber('0.1')).to.be(0.1);
      expect(reiterate.$.toNumber('1.1')).to.be(1.1);
    });

    it('date', function () {
      var dateInt;

      expect(function () {
        dateInt = reiterate.$.toNumber(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof dateInt === 'number').to.be.ok();
      expect(reiterate.$.numIsNaN(dateInt)).to.not.be.ok();
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber('NaN'))).to.be.ok();
      expect(reiterate.$.toNumber('Infinity')).to.be(Infinity);
      expect(reiterate.$.toNumber('-Infinity')).to.be(-Infinity);
    });

    it('array', function () {
      expect(reiterate.$.toNumber([])).to.be(0);
      expect(reiterate.$.toNumber([1])).to.be(1);
      expect(reiterate.$.toNumber([1.1])).to.be(1.1);
      /*jshint -W047 */
      expect(reiterate.$.toNumber([1.])).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toNumber([''])).to.be(0);
      expect(reiterate.$.toNumber(['1'])).to.be(1);
      expect(reiterate.$.toNumber(['1.1'])).to.be(1.1);
    });

    it('object', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({}))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: ''
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: '1'
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1
      }))).to.be.ok();
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1.1
      }))).to.be.ok();
      /*jshint -W047 */
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber({
        valueOf: 1.
      }))).to.be.ok();
      /*jshint +W047 */
    });

    it('function', function () {
      expect(reiterate.$.numIsNaN(reiterate.$.toNumber(function () {
        return 1;
      }))).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],57:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.toObject', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.toObject();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.toObject(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.toObject(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an error in each case', function () {
      expect(typeof reiterate.$.toObject(1)).to.be('object');
      expect(typeof reiterate.$.toObject(true)).to.be('object');
      expect(typeof reiterate.$.toObject('')).to.be('object');
      expect(typeof reiterate.$.toObject([])).to.be('object');
      expect(typeof reiterate.$.toObject({})).to.be('object');
      expect(typeof reiterate.$.toObject(Object('a'))).to.be('object');
      expect(typeof reiterate.$.toObject(reiterate.$.noop)).to.be('function');
      expect(typeof reiterate.$.toObject(new Date())).to.be('object');
      expect(reiterate.$.toObject(new RegExp('c')).toString()).to.be('/c/');
    });

    it('should have correct values', function () {
      var str = reiterate.$.toObject('foo');

      expect(typeof str).to.be('object');
      expect(str.length).to.be(3);
      expect(reiterate.$.toStringTag(str)).to.be('[object String]');
      expect(str.toString()).to.be('foo');
      expect(str.charAt(0)).to.be('f');
      expect(str.charAt(1)).to.be('o');
      expect(str.charAt(2)).to.be('o');
    });

    it('should be same object', function () {
      var testObject = [];

      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = {};
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = reiterate.$.noop;
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object('test');
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object(true);
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
      testObject = Object(10);
      expect(reiterate.$.toObject(testObject)).to.be(testObject);
    });
  });
}());

},{"../../scripts/":9}],58:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.toPrimitive', function () {
    it('should throw a TypeError in each case', function () {
      expect(function () {
        reiterate.$.toPrimitive({
          toString: ''
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: '1'
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1.1
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      /*jshint -W047 */
      expect(function () {
        reiterate.$.toPrimitive({
          toString: 1.
        });
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
      /*jshint +W047 */
    });

    it('argument missing, undefined and null', function () {
      expect(reiterate.$.toPrimitive()).to.be(undefined);
      expect(reiterate.$.toPrimitive(undefined)).to.be(undefined);
      expect(reiterate.$.toPrimitive(null)).to.be(null);
    });

    it('number', function () {
      expect(reiterate.$.toPrimitive(-10.123)).to.be(-10.123);
      expect(reiterate.$.toPrimitive(0)).to.be(0);
      expect(reiterate.$.toPrimitive(0.123)).to.be(0.123);
      expect(reiterate.$.toPrimitive(10)).to.be(10);
      expect(reiterate.$.toPrimitive(10.123)).to.be(10.123);
      expect(reiterate.$.toPrimitive(Infinity)).to.be(Infinity);
      expect(reiterate.$.toPrimitive(-Infinity)).to.be(-Infinity);
      expect(reiterate.$.numIsNaN(reiterate.$.toPrimitive(NaN))).to.be.ok();
    });

    it('string', function () {
      expect(reiterate.$.toPrimitive('')).to.be('');
      expect(reiterate.$.toPrimitive(' ')).to.be(' ');
      expect(reiterate.$.toPrimitive('x')).to.be('x');
    });

    it('boolean', function () {
      expect(reiterate.$.toPrimitive(true)).to.be(true);
      expect(reiterate.$.toPrimitive(false)).to.be(false);
    });

    it('mixed objects', function () {
      expect(reiterate.$.toPrimitive({})).to.be.ok();
      expect(reiterate.$.toPrimitive([])).to.be('');
      expect(reiterate.$.toPrimitive([10.123])).to.be('10.123');
      expect(reiterate.$.toPrimitive(new RegExp('c'))).to.be(new RegExp('c')
        .toString());
      expect(reiterate.$.toPrimitive(new Error('x')))
        .to.be(new Error('x').toString());
      expect(reiterate.$.toPrimitive(new Date(123456789)))
        .to.be(new Date(123456789).toString());
      expect(reiterate.$.toPrimitive(new Date(123456789), 'number'))
      .to.be(123456789);
    });

    it('tens', function () {
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive(10.)).to.be(10);
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive(10.0)).to.be(10);
      expect(reiterate.$.toPrimitive('10.')).to.be('10.');
      expect(reiterate.$.toPrimitive(' 10.')).to.be(' 10.');
      expect(reiterate.$.toPrimitive('10. ')).to.be('10. ');
      expect(reiterate.$.toPrimitive(' 10. ')).to.be(' 10. ');
      expect(reiterate.$.toPrimitive('10.0')).to.be('10.0');
      expect(reiterate.$.toPrimitive(' 10.0')).to.be(' 10.0');
      expect(reiterate.$.toPrimitive('10.0 ')).to.be('10.0 ');
      expect(reiterate.$.toPrimitive(' 10.0 ')).to.be(' 10.0 ');
      expect(reiterate.$.toPrimitive('10.123')).to.be('10.123');
      expect(reiterate.$.toPrimitive(' 10.123')).to.be(' 10.123');
      expect(reiterate.$.toPrimitive('10.123 ')).to.be('10.123 ');
      expect(reiterate.$.toPrimitive(' 10.123 ')).to.be(' 10.123 ');
    });

    it('-1, 0, 1', function () {
      expect(reiterate.$.toPrimitive('-1')).to.be('-1');
      expect(reiterate.$.toPrimitive('0')).to.be('0');
      expect(reiterate.$.toPrimitive('1')).to.be('1');
      expect(reiterate.$.toPrimitive('-1.')).to.be('-1.');
      expect(reiterate.$.toPrimitive('0.')).to.be('0.');
      expect(reiterate.$.toPrimitive('1.')).to.be('1.');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive(-1.)).to.be(-1);
      expect(reiterate.$.toPrimitive(0.)).to.be(0);
      expect(reiterate.$.toPrimitive(1.)).to.be(1);
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive('-1.1')).to.be('-1.1');
      expect(reiterate.$.toPrimitive('0.1')).to.be('0.1');
      expect(reiterate.$.toPrimitive('1.1')).to.be('1.1');
    });

    it('date', function () {
      var date;

      expect(function () {
        date = reiterate.$.toPrimitive(new Date(2013, 11, 11));
      }).to.not.throwException();

      expect(typeof date === 'string').to.be.ok();
      expect(date).to.be(new Date(2013, 11, 11).toString());

      expect(function () {
        date = reiterate.$.toPrimitive(new Date(2013, 11, 11), 'number');
      }).to.not.throwException();

      expect(typeof date === 'number').to.be.ok();
      expect(date).to.be(new Date(2013, 11, 11).valueOf());
    });

    it('string NaN, Infinity, -Infinity', function () {
      expect(reiterate.$.toPrimitive('NaN')).to.be('NaN');
      expect(reiterate.$.toPrimitive('Infinity')).to.be('Infinity');
      expect(reiterate.$.toPrimitive('-Infinity')).to.be('-Infinity');
    });

    it('array', function () {
      expect(reiterate.$.toPrimitive([])).to.be('');
      expect(reiterate.$.toPrimitive([1])).to.be('1');
      expect(reiterate.$.toPrimitive([1.1])).to.be('1.1');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive([1.])).to.be('1');
      /*jshint +W047 */
      expect(reiterate.$.toPrimitive([''])).to.be('');
      expect(reiterate.$.toPrimitive(['1', '2'])).to.be('1,2');
      expect(reiterate.$.toPrimitive(['1.1'])).to.be('1.1');
    });

    it('object', function () {
      expect(reiterate.$.toPrimitive({})).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: ''
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: '1'
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: 1
      })).to.be('[object Object]');
      expect(reiterate.$.toPrimitive({
        valueOf: 1.1
      })).to.be('[object Object]');
      /*jshint -W047 */
      expect(reiterate.$.toPrimitive({
        valueOf: 1.
      })).to.be('[object Object]');
      /*jshint +W047 */
    });

    it('function', function () {
      var fn = function () {
        return 1;
      };

      expect(reiterate.$.toPrimitive(fn)).to.be(fn.toString());
    });
  });
}());

},{"../../scripts/":9}],59:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.assign', function () {
    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.assign();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.assign(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.assign(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if source argument is undefined', function () {
      expect(function () {
        reiterate.$.assign({}, undefined);
      }).to.not.throwException();
    });

    it('should throw if source argument is null', function () {
      expect(function () {
        reiterate.$.assign({}, null);
      }).to.not.throwException();
    });

    it('returns the modified target object', function () {
      var target = {},
        returned = reiterate.$.assign(target, {
          a: 1
        });

      expect(returned).to.equal(target);
    });

    it('should return target if no sources', function () {
      var target = {};

      expect(reiterate.$.assign(target)).to.be(target);
    });

    it('should merge two objects', function () {
      var target = {
          a: 1
        },
        returned = reiterate.$.assign(target, {
          b: 2
        });

      expect(returned).to.eql({
        a: 1,
        b: 2
      });
    });

    it('should merge three objects', function () {
      var target = {
          a: 1
        },
        source1 = {
          b: 2
        },
        source2 = {
          c: 3
        },
        returned = reiterate.$.assign(target, source1, source2);

      expect(returned).to.eql({
        a: 1,
        b: 2,
        c: 3
      });
    });

    it('only iterates over own keys', function () {
      var Foo = function () {
          return;
        },
        target = {
          a: 1
        },
        foo,
        returned;

      Foo.prototype.bar = true;
      foo = new Foo();
      foo.baz = true;
      returned = reiterate.$.assign(target, foo);
      expect(returned).to.equal(target);
      expect(target).to.eql({
        baz: true,
        a: 1
      });
    });

    it('works with arrays', function () {
      var x = required.create(undefined, undefined, undefined, {}, 4, 5, 6),
        y = required.create(1, null, undefined, {}, 4, 5, 6);

      delete x[0];
      delete x[1];
      delete x[2];
      expect(reiterate.$.assign([1, 2, 3], x)).to.eql([1, 2, 3, {}, 4, 5, 6]);
      expect(reiterate.$.assign([1, 2, 3], y)).to.eql(y);

      expect(reiterate.$.assign([1, 2, 3], {
        3: 4,
        4: 5,
        5: 6,
        length: 6
      })).to.eql([1, 2, 3, 4, 5, 6]);

      expect(reiterate.$.assign([1, 2, 3, 6, 7, 8, 9], {
        3: 4,
        4: 5,
        5: 6,
        length: 6
      })).to.eql([1, 2, 3, 4, 5, 6]);

      expect(reiterate.$.assign([1, 2, 3, 6, 7, 8, 9], {
        3: 4,
        4: 5,
        5: 6
      })).to.eql([1, 2, 3, 4, 5, 6, 9]);
    });

    it('should not throw when target is not an object', function () {
      expect(function () {
        reiterate.$.assign(true, {});
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign(1, {});
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign('a', {});
      }).to.not.throwException();
    });

    it('should not throw when source is not an object', function () {
      var target = {};

      expect(function () {
        reiterate.$.assign(target, true);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.assign(target, 1);
      }).to.not.throwException();
      expect(function () {
        reiterate.$.assign(target, 'a');
      }).to.not.throwException();
    });
  });
}());

},{"../../scripts/":9}],60:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.hasOwnProperty', function () {
    /*jshint -W001 */
    var obj = {
        'toString': reiterate.$.noop,
        'toLocaleString': reiterate.$.noop,
        'valueOf': reiterate.$.noop,
        'hasOwnProperty': reiterate.$.noop,
        'isPrototypeOf': reiterate.$.noop,
        'propertyIsEnumerable': reiterate.$.noop,
        'constructor': reiterate.$.noop
      },
      obj2 = {};
    /*jshint +W001 */

    it('defined on object "toString"', function () {
      expect(reiterate.$.hasOwn(obj, 'toString')).to.be.ok();
    });

    it('defined on object "toLocaleString"', function () {
      expect(reiterate.$.hasOwn(obj, 'toLocaleString')).to.be.ok();
    });

    it('defined on object "valueOf"', function () {
      expect(reiterate.$.hasOwn(obj, 'valueOf')).to.be.ok();
    });

    it('defined on object "hasOwnProperty"', function () {
      expect(reiterate.$.hasOwn(obj, 'hasOwnProperty')).to.be.ok();
    });

    it('defined on object "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn(obj, 'isPrototypeOf')).to.be.ok();
    });

    it('defined on object "propertyIsEnumerable"', function () {
      expect(reiterate.$.hasOwn(obj, 'propertyIsEnumerable')).to.be.ok();
    });

    it('defined on object "constructor"', function () {
      expect(reiterate.$.hasOwn(obj, 'constructor')).to.be.ok();
    });

    it('properties that are not defined', function () {
      expect(reiterate.$.hasOwn(obj, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj, 'fuz')).to.not.be.ok();
    });

    it('not defined on object "toString"', function () {
      expect(reiterate.$.hasOwn(obj2, 'toString')).to.not.be.ok();
    });

    it('not defined on object "toLocaleString"', function () {
      expect(reiterate.$.hasOwn(obj2, 'toLocaleString')).to.not.be.ok();
    });

    it('not defined on object "valueOf"', function () {
      expect(reiterate.$.hasOwn(obj2, 'valueOf')).to.not.be.ok();
    });

    it('not defined on object "hasOwnProperty"', function () {
      expect(reiterate.$.hasOwn(obj2, 'hasOwnProperty')).to.not.be.ok();
    });

    it('not defined on object "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn(obj2, 'isPrototypeOf')).to.not.be.ok();
    });

    it('not defined on object "propertyIsEnumerable"', function () {
      expect(reiterate.$.hasOwn(obj2, 'propertyIsEnumerable')).to.not.be.ok();
    });

    it('not defined on object "constructor"', function () {
      expect(reiterate.$.hasOwn(obj2, 'constructor')).to.not.be.ok();
    });

    it('not defined on object should be not ok in each case', function () {
      expect(reiterate.$.hasOwn(obj2, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj2, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasOwn(obj2, 'fuz')).to.not.be.ok();
    });

    it('defined on object with "undefined" value "toString"', function () {
      expect(reiterate.$.hasOwn({
        toString: undefined
      }, 'toString')).to.be.ok();
    });

    it('defined on object with "undefined" value "toLocaleString"', function () {
      expect(reiterate.$.hasOwn({
        toLocaleString: undefined
      }, 'toLocaleString')).to.be.ok();
    });

    it('defined on object with "undefined" value "valueOf"', function () {
      expect(reiterate.$.hasOwn({
        valueOf: undefined
      }, 'valueOf')).to.be.ok();
    });

    it('defined on object with "undefined" value "hasOwnProperty"', function () {
      /*jshint -W001 */
      expect(reiterate.$.hasOwn({
        hasOwnProperty: undefined
      }, 'hasOwnProperty')).to.be.ok();
      /*jshint +W001 */
    });

    it('defined on object with "undefined" value "isPrototypeOf"', function () {
      expect(reiterate.$.hasOwn({
        isPrototypeOf: undefined
      }, 'isPrototypeOf')).to.be.ok();
    });

    it(
      'defined on object with "undefined" value "propertyIsEnumerable"',
      function () {
        expect(reiterate.$.hasOwn({
          propertyIsEnumerable: undefined
        }, 'propertyIsEnumerable')).to.be.ok();
      }
    );

    it('defined on object with "undefined" value "constructor"', function () {
      expect(reiterate.$.hasOwn({
        constructor: undefined
      }, 'constructor')).to.be.ok();
    });

    it('string defined', function () {
      var str = 'abc';

      expect(reiterate.$.hasOwn(str, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(str, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(str, '2')).to.be.ok();
    });

    it('string not-defined', function () {
      var str = 'abc';

      expect(reiterate.$.hasOwn(str, '3')).to.not.be.ok();
    });

    it('string object defined', function () {
      var strObj = Object('abc');

      expect(reiterate.$.hasOwn(strObj, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(strObj, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(strObj, '2')).to.be.ok();
    });

    it('string object not-defined', function () {
      var strObj = Object('abc');

      expect(reiterate.$.hasOwn(strObj, '3')).to.not.be.ok();
    });

    it('arguments defined', function () {
      var args = reiterate.$.returnArgs(false, undefined, null, '', 0);

      expect(reiterate.$.hasOwn(args, '0')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '1')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '2')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '3')).to.be.ok();
      expect(reiterate.$.hasOwn(args, '4')).to.be.ok();
    });

    it('arguments not-defined', function () {
      var args = reiterate.$.returnArgs(false, undefined, null, '', 0);

      expect(reiterate.$.hasOwn(args, '5')).to.not.be.ok();
    });

    it('should not list prototype or constructor', function () {
      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;
      expect(reiterate.$.hasOwn(Constructor, 'constructor')).to.not.be.ok();
    });

    it('should list prototype and constructor', function () {
      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;
      expect(reiterate.$.hasOwn(Constructor, 'prototype')).to.be.ok();
      expect(reiterate.$.hasOwn(Constructor.prototype, 'constructor'))
        .to.be.ok();
      expect(reiterate.$.hasOwn(new Constructor(), 'prototype')).to.be.ok();
      expect(reiterate.$.hasOwn(new Constructor(), 'constructor')).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],61:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.hasProperty', function () {
    it('object, enumerable bugged properties', function () {
      var testObj = [];

      expect(reiterate.$.hasProperty(testObj, 'toString')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'toLocaleString')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'valueOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'hasOwnProperty')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'isPrototypeOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'propertyIsEnumerable'))
        .to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'constructor')).to.be.ok();
    });

    it('array, enumerable bugged properties', function () {
      var testArr = [];

      expect(reiterate.$.hasProperty(testArr, 'toString')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'toLocaleString')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'valueOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'hasOwnProperty')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'isPrototypeOf')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'propertyIsEnumerable'))
        .to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'constructor')).to.be.ok();
    });

    it('function prototype property', function () {
      expect(reiterate.$.hasProperty(function () {
        return;
      }, 'prototype')).to.be.ok();
    });

    it('string index, literal and object', function () {
      var testStr = 'abc',
        testObj = Object(testStr);

      expect(reiterate.$.hasProperty(testStr, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testStr, 3)).to.not.be.ok();
      expect(reiterate.$.hasProperty(testObj, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 3)).to.not.be.ok();
    });

    it('array index', function () {
      var testArr = ['a', 'b', 'c'];

      expect(reiterate.$.hasProperty(testArr, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 3)).to.not.be.ok();
    });

    it('arguments index', function () {
      var testArg = reiterate.$.returnArgs('a', 'b', 'c');

      expect(reiterate.$.hasProperty(testArg, 0)).to.be.ok();
      expect(reiterate.$.hasProperty(testArg, 3)).to.not.be.ok();
    });

    it('array prototype methods', function () {
      var testArr = [];

      expect(reiterate.$.hasProperty(testArr, 'push')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'pop')).to.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'foo')).to.not.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'bar')).to.not.be.ok();
      expect(reiterate.$.hasProperty(testArr, 'fuz')).to.not.be.ok();
    });

    it('object direct properties', function () {
      var testObj = {
        foo: undefined,
        bar: null
      };

      if (testObj.getPrototypeOf) {
        expect(reiterate.$.hasProperty(testObj, 'getPrototypeOf')).to.be.ok();
      }

      expect(reiterate.$.hasProperty(testObj, 'foo')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'bar')).to.be.ok();
      expect(reiterate.$.hasProperty(testObj, 'fuz')).to.not.be.ok();
    });
  });
}());

},{"../../scripts/":9}],62:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.is', function () {
    var date = new Date(),
      rx = new RegExp('x'),
      err = new Error('y');

    it('should not throw an error in each case', function () {
      expect(reiterate.$.is(undefined, undefined)).to.be.ok();
      expect(reiterate.$.is(null, null)).to.be.ok();
      expect(reiterate.$.is(1, 1)).to.be.ok();
      expect(reiterate.$.is(true, true)).to.be.ok();
      expect(reiterate.$.is('x', 'x')).to.be.ok();
      expect(reiterate.$.is([1, 2, 3], [1, 2, 3])).to.not.be.ok();
      expect(reiterate.$.is(reiterate.$.returnArgs(), reiterate.$.returnArgs()))
        .to.not.be.ok();
      expect(reiterate.$.is({}, {}), false, 'Object.is');
      expect(reiterate.$.is(reiterate.$.noop, reiterate.$.noop)).to.be.ok();
      expect(reiterate.$.is(new RegExp('c'), new RegExp('c'))).to.not.be.ok();
      expect(reiterate.$.is(new Date(2013, 11, 23), new Date(2013, 11, 23)))
        .to.not.be.ok();
      expect(reiterate.$.is(new Error('x'), new Error('x'))).to.not.be.ok();
      expect(reiterate.$.is(date, date)).to.be.ok();
      expect(reiterate.$.is(rx, rx)).to.be.ok();
      expect(reiterate.$.is(err, err)).to.be.ok();
      expect(reiterate.$.is(NaN, NaN)).to.be.ok();
      expect(reiterate.$.is(0, -0)).to.not.be.ok();
      expect(reiterate.$.is(0, 0)).to.be.ok();
      expect(reiterate.$.is(0, +0)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],63:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.isNil', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isNil()).to.be.ok();
      expect(reiterate.$.isNil(null)).to.be.ok();
      expect(reiterate.$.isNil(undefined)).to.be.ok();
      expect(reiterate.$.isNil('undefined')).to.not.be.ok();
      expect(reiterate.$.isNil('null')).to.not.be.ok();
      expect(reiterate.$.isNil(0)).to.not.be.ok();
      expect(reiterate.$.isNil(1)).to.not.be.ok();
      expect(reiterate.$.isNil('')).to.not.be.ok();
      expect(reiterate.$.isNil([])).to.not.be.ok();
      expect(reiterate.$.isNil({})).to.not.be.ok();
    });
  });
}());

},{"../../scripts/":9}],64:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.isNull', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isNull()).to.not.be.ok();
      expect(reiterate.$.isNull(null)).to.be.ok();
      expect(reiterate.$.isNull(undefined)).to.not.be.ok();
      expect(reiterate.$.isNull('undefined')).to.not.be.ok();
      expect(reiterate.$.isNull('null')).to.not.be.ok();
      expect(reiterate.$.isNull(0)).to.not.be.ok();
      expect(reiterate.$.isNull(1)).to.not.be.ok();
      expect(reiterate.$.isNull('')).to.not.be.ok();
      expect(reiterate.$.isNull([])).to.not.be.ok();
      expect(reiterate.$.isNull({})).to.not.be.ok();
    });
  });
}());

},{"../../scripts/":9}],65:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.isObject', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isObject()).to.not.be.ok();
      expect(reiterate.$.isObject(null)).to.not.be.ok();
      expect(reiterate.$.isObject('')).to.not.be.ok();
      expect(reiterate.$.isObject(1)).to.not.be.ok();
      expect(reiterate.$.isObject(false)).to.not.be.ok();
      expect(reiterate.$.isObject({})).to.be.ok();
      expect(reiterate.$.isObject([])).to.be.ok();
      expect(reiterate.$.isObject(reiterate.$.noop)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}],66:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.isUndefined', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isUndefined()).to.be.ok();
      expect(reiterate.$.isUndefined(null)).to.not.be.ok();
      expect(reiterate.$.isUndefined(undefined)).to.be.ok();
      expect(reiterate.$.isUndefined('undefined')).to.not.be.ok();
      expect(reiterate.$.isUndefined('null')).to.not.be.ok();
      expect(reiterate.$.isUndefined(0)).to.not.be.ok();
      expect(reiterate.$.isUndefined(1)).to.not.be.ok();
      expect(reiterate.$.isUndefined('')).to.not.be.ok();
      expect(reiterate.$.isUndefined([])).to.not.be.ok();
      expect(reiterate.$.isUndefined({})).to.not.be.ok();
    });
  });
}());

},{"../../scripts/":9}],67:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.keys', function () {
    /*jshint -W001 */
    var loopedValues = [
        'str',
        'obj',
        'arr',
        'bool',
        'num',
        'null',
        'undefined',
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      obj = {
        'str': 'boz',
        'obj': {},
        'arr': [],
        'bool': true,
        'num': 42,
        'null': null,
        'undefined': undefined,
        'toString': reiterate.$.noop,
        'toLocaleString': reiterate.$.noop,
        'valueOf': reiterate.$.noop,
        'hasOwnProperty': reiterate.$.noop,
        'isPrototypeOf': reiterate.$.noop,
        'propertyIsEnumerable': reiterate.$.noop,
        'constructor': reiterate.$.noop
      },
      keys = reiterate.$.keys(obj),
      loopedValues2 = [
        'str',
        'obj',
        'arr',
        'bool',
        'num',
        'null',
        'undefined'
      ],
      obj2 = {
        'str': 'boz',
        'obj': {},
        'arr': [],
        'bool': true,
        'num': 42,
        'null': null,
        'undefined': undefined
      },
      keys2 = reiterate.$.keys(obj2);
    /*jshint +W001 */

    it('should throw if no arguments', function () {
      expect(function () {
        reiterate.$.keys();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is undefined', function () {
      expect(function () {
        reiterate.$.keys(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should throw if argument is null', function () {
      expect(function () {
        reiterate.$.keys(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });
    });

    it('should not throw an TypeError if argument is primitive', function () {
      var primKeys;

      expect(function () {
        primKeys = reiterate.$.keys(42);
      }).to.not.throwException();

      expect(primKeys.length).to.be(0);

      expect(function () {
        primKeys = reiterate.$.keys(true);
      }).to.not.throwException();

      expect(primKeys.length).to.be(0);

      expect(function () {
        primKeys = reiterate.$.keys('abc');
      }).to.not.throwException();

      expect(primKeys.length).to.be(3);
    });

    it('should not throw an error in each case', function () {
      expect(keys.length).to.be(14);
      expect(reiterate.$.isArray(keys)).to.be.ok();
      reiterate.$.forEach(keys, function (name) {
        expect(Object.prototype.hasOwnProperty.call(obj, name)).to.be.ok();
      });

      reiterate.$.forEach(keys, function (name) {
        // should return names which are enumerable
        expect(reiterate.$.indexOf(loopedValues, name)).not.to.be(-1);
      });

      expect(keys2.length).to.be(7);
      expect(reiterate.$.isArray(keys2)).to.be.ok();
      reiterate.$.forEach(keys2, function (name) {
        expect(Object.prototype.hasOwnProperty.call(obj, name)).to.be.ok();
      });

      reiterate.$.forEach(keys2, function (name) {
        // should return names which are enumerable
        expect(reiterate.$.indexOf(loopedValues2, name)).not.to.be(-1);
      });
    });

    it('should work with arguments object', function () {
      var testValue = [0, 1],
        theArgs = reiterate.$.returnArgs(1, 2),
        theKeys;

      expect(function () {
        theKeys = reiterate.$.keys(theArgs);
      }).to.not.throwException();

      expect(theKeys.length).to.be(2);
      expect(theKeys).to.eql(testValue);
    });

    it('should work with string object', function () {
      var testValue = ['0', '1', '2'],
        theObj = Object('hej'),
        theKeys;

      expect(function () {
        theKeys = reiterate.$.keys(theObj);
      }).to.not.throwException();

      expect(theKeys).to.eql(testValue);
      expect(theKeys.length).to.be(3);
    });

    it('Constructor should not list prototype or constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(Constructor);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Constructor prototype should not list constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(Constructor.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('should list prototype and constructor', function () {
      var pKeys;

      function Constructor() {
        this.constructor = this.prototype = 1;
      }

      Constructor.prototype.constructor = 1;

      expect(function () {
        pKeys = reiterate.$.keys(new Constructor());
      }).to.not.throwException();

      expect(pKeys.sort()).to.eql(['constructor', 'prototype']);
    });

    it('Object prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Object.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('Function prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Function.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('Boolean prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Boolean.prototype);
      }).to.not.throwException(function (e) {
        expect(e).to.be(undefined);
      });

      expect(pKeys).to.eql([]);
    });

    it('String prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(String.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Number prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Number.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Error prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Error.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('TypeError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(TypeError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('SyntaxError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(SyntaxError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('RangeError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(RangeError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('EvalError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(EvalError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('URIError prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(URIError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('ReferenceError prototypes should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(ReferenceError.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('Date prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Date.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('RegExp prototype should not list', function () {
      var pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(RegExp.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });

    it('should not enumerate over non-enumerable properties', function () {
      var Foo = function () {
          return;
        },
        pKeys;

      expect(function () {
        pKeys = reiterate.$.keys(Foo.prototype);
      }).to.not.throwException();

      expect(pKeys).to.eql([]);
    });
  });
}());

},{"../../scripts/":9}],68:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.toStringTag', function () {
    it('basic', function () {
      expect(reiterate.$.toStringTag()).to.be('[object Undefined]');
      expect(reiterate.$.toStringTag(undefined)).to.be('[object Undefined]');
      expect(reiterate.$.toStringTag(null)).to.be('[object Null]');
      expect(reiterate.$.toStringTag(1)).to.be('[object Number]');
      expect(reiterate.$.toStringTag(true)).to.be('[object Boolean]');
      expect(reiterate.$.toStringTag('x')).to.be('[object String]');
      expect(reiterate.$.toStringTag([1, 2, 3])).to.be('[object Array]');
      expect(reiterate.$.toStringTag(reiterate.$.returnArgs()))
        .to.be('[object Arguments]');
      expect(reiterate.$.toStringTag({})).to.be('[object Object]');
      expect(reiterate.$.toStringTag(reiterate.$.noop)).to.be('[object Function]');
      expect(reiterate.$.toStringTag(new RegExp('c'))).to.be('[object RegExp]');
      expect(reiterate.$.toStringTag(new Date())).to.be('[object Date]');
      expect(reiterate.$.toStringTag(new Error('x'))).to.be('[object Error]');
    });

    it('Object prototypes', function () {
      expect(reiterate.$.toStringTag(Object.prototype))
        .to.be('[object Object]');
      expect(reiterate.$.toStringTag(Array.prototype)).to.be('[object Array]');
      expect(reiterate.$.toStringTag(Boolean.prototype))
        .to.be('[object Boolean]');
      expect(reiterate.$.toStringTag(Number.prototype))
        .to.be('[object Number]');
      expect(reiterate.$.toStringTag(String.prototype))
        .to.be('[object String]');
      expect(reiterate.$.toStringTag(Error.prototype)).to.be('[object Error]');
      expect(reiterate.$.toStringTag(Date.prototype)).to.be('[object Date]');
      expect(reiterate.$.toStringTag(RegExp.prototype))
        .to.be('[object RegExp]');
      expect(reiterate.$.toStringTag(Function.prototype))
        .to.be('[object Function]');
    });
  });
}());

},{"../../scripts/":9}],69:[function(require,module,exports){
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('String.isString', function () {
    it('should not throw an error in each case', function () {
      expect(reiterate.$.isString(Object('a'))).to.be.ok();
      expect(reiterate.$.isString(true)).to.not.be.ok();
      expect(reiterate.$.isString(false)).to.not.be.ok();
      expect(reiterate.$.isString()).to.not.be.ok();
      expect(reiterate.$.isString(null)).to.not.be.ok();
      expect(reiterate.$.isString('')).to.be.ok();
      expect(reiterate.$.isString(0)).to.not.be.ok();
      expect(reiterate.$.isString(1)).to.not.be.ok();
      expect(reiterate.$.isString({})).to.not.be.ok();
      expect(reiterate.$.isString([])).to.not.be.ok();
      expect(reiterate.$.isString(String.prototype)).to.be.ok();
    });
  });
}());

},{"../../scripts/":9}]},{},[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,59,60,61,62,63,64,65,66,67,55,56,57,58,68,69]);
