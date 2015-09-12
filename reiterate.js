/**
 * @file {@link https://github.com/Xotic750/ES6-reiterate reiterate}.
 * A Javascript generator and iterator library.
 * @version 0.1.0
 * @author Graham Fairweather <xotic750@gmail.com>
 * @copyright Copyright (c) 2013 Graham Fairweather
 * @license {@link <http://www.gnu.org/licenses/gpl-3.0.html> GPL3}
 * @module reiterate
 */

/*jslint maxlen:80, es6:true, this:true */
/*jshint esnext: true */

/*global
    define, module
*/

/*property
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, abs, amd, bind, call, charCodeAt,
    configurable, create, defineProperties, defineProperty, enumerable,
    exports, floor, from, fromCodePoint, getOwnPropertyNames,
    getOwnPropertySymbols, hasOwnProperty, isArray, isFinite, isNaN, iterator,
    keys, length, max, min, prototype, reverse, reversed, sign, started,
    toString, unscopables, value, values, writable
*/

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
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
}(this, function () {
  'use strict';

  /*
   * const
   */

  var $DEVELOPSTRICT = true,
    $SY = Symbol,
    $SU = $SY.unscopables,
    $SI = $SY.iterator,
    $O = Object,
    $OP = $O.prototype,
    $A = Array,
    $AP = $A.prototype,
    $APU = $AP[$SU],
    $S = String,
    $SP = $S.prototype,
    $F = Function,
    $CALL = $F.call,
    $HOP = $CALL.bind($OP.hasOwnProperty),
    $TOSTRINGTAG = $CALL.bind($OP.toString),
    $STRINGTAG = $TOSTRINGTAG($SP),
    $N = Number,
    $NP = $N.prototype,
    $NUMBERTAG = $TOSTRINGTAG($NP),
    $FUNCTIONTYPE = typeof $F,
    $SYMBOLTYPE = typeof $SI,
    $M = Math,
    $FLOOR = $M.floor,
    $ABS = $M.abs,
    $MAX = $M.max,
    $MIN = $M.min,
    $SIGN = $M.sign,
    $MIN_SAFE_INTEGER = $N.MIN_SAFE_INTEGER,
    $MAX_SAFE_INTEGER = $N.MAX_SAFE_INTEGER,
    $DEFINEPROPERTY = $O.defineProperty,
    //$DEFINEPROPERTIES = $O.defineProperties,
    $CREATE = $O.create,
    $OBJECTKEYS = $O.keys,
    $GOPN = $O.getOwnPropertyNames,
    $GOPS = $O.getOwnPropertySymbols,
    $ISNAN = $N.isNaN,
    $ISFINITE = $N.isFinite,
    $FROMCODEPOINT = $S.fromCodePoint,
    $ISARRAY = $A.isArray,
    $METHODDESCRIPTOR = $CREATE(null, {
      enumerable: {
        enumerable: true,
        writable: false,
        configurable: false,
        value: false
      },
      writable: {
        enumerable: true,
        writable: false,
        configurable: false,
        value: true
      },
      configurable: {
        enumerable: true,
        writable: false,
        configurable: false,
        value: true
      },
      value: {
        enumerable: true,
        writable: true,
        configurable: false,
        value: undefined
      }
    }),
    $TE = TypeError,
    $E = {};

  /*
   * let
   */

  var $ARRAYFROM = $A.from;

  /*
   * utils
   */

  function setProperty(object, property, value) {
    if (!$HOP(object, property)) {
      $METHODDESCRIPTOR.value = value;
      $DEFINEPROPERTY(object, property, $METHODDESCRIPTOR);
      if ($APU && object === $AP) {
        $APU[property] = true;
      }
    }

    return value;
  }

  setProperty($E, 'Array', {});
  setProperty($E, 'String', {});
  setProperty($E, 'Object', {});

  /**
   * Returns true if the operand inputArg is null or undefined.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  function isNil(subject) {
    /*jshint eqnull:true */
    return subject == null;
  }

  /**
   * The abstract operation throws an error if its argument is a value that
   * cannot be  converted to an Object, otherwise returns the argument.
   *
   * @private
   * @param {*} inputArg
   * @throws {TypeError} If inputArg is null or undefined.
   * @return {*}
   * @see http://www.ecma-international.org/ecma-262/6.0/
   *      #sec-requireobjectcoercible
   */
  function $RequireObjectCoercible(subject) {
    if (isNil(subject)) {
      /*jshint newcap:false */
      throw new $TE('Cannot convert undefined or null to object');
    }

    return subject;
  }

  /**
   * The abstract operation converts its argument to a value of type Object.
   *
   * @private
   * @param {*} subject
   * @throws {TypeError} If subject is null or undefined.
   * @return {Object}
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
   */
  function $ToObject(subject) {
    return $O($RequireObjectCoercible(subject));
  }

  /**
   * Returns a string only if the arguments is coercible otherwise throws an
   * error.
   *
   * @private
   * @param {*} subject
   * @throws {TypeError} If subject is null or undefined.
   * @return {string}
   */
  function $OnlyCoercibleToString(subject) {
    return $S($RequireObjectCoercible(subject));
  }

  /**
   * The function evaluates the passed value and converts it to an integer.
   *
   * @private
   * @param {*} subject The object to be converted to an integer.
   * @return {number} If the target value is NaN, null or undefined, 0 is
   *                  returned. If the target value is false, 0 is returned and
   *                  if true, 1 is returned.
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger
   */
  function $ToInteger(subject) {
    var number = +subject,
      val = 0;

    if (!$ISNAN(number)) {
      if (!number || !$ISFINITE(number)) {
        val = number;
      } else {
        val = $SIGN(number) * $FLOOR($ABS(number));
      }
    }

    return val;
  }

  /**
   * Returns true if the operand inputArg is a Number.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  function isNumber(subject) {
    return $TOSTRINGTAG(subject) === $NUMBERTAG;
  }

  /**
   * Returns a number clamped to the range set by min and max.
   *
   * @private
   * @param {number} number
   * @param {number} min
   * @param {number} max
   * @throws {TypeError} If params are not of number type.
   * @return {number}
   */
  function clamp(number, min, max) {
    if (!isNumber(number) || !isNumber(min) || !isNumber(max)) {
      /*jshint newcap:false */
      throw new $TE('argument is not of type number');
    }
    return $MIN($MAX(number, min), max);
  }

  /**
   * The abstract operation ToLength converts its argument to an integer
   * suitable for use as the length of an array-like object.
   *
   * @private
   * @param {*} subject The object to be converted to a length.
   * @return {number} If len <= +0 then +0 else if len is +INFINITY then 2^53-1
   *                  else min(len, 2^53-1).
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tolength
   */
  function $ToLength(subject) {
    return clamp($ToInteger(subject), 0, $MAX_SAFE_INTEGER);
  }

  /**
   * The function evaluates the passed value and converts it to a safe integer.
   *
   * @private
   * @param {*} subject
   * @return {number}
   */
  function $ToSafeInteger(subject) {
    return clamp($ToInteger(subject), $MIN_SAFE_INTEGER, $MAX_SAFE_INTEGER);
  }

  /**
   * Returns true if the operand subject is a Function
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a function,
   *                   otherwise false.
   */
  function isFunction(subject) {
    return typeof subject === $FUNCTIONTYPE;
  }

  /**
   * Returns true if the operand subject is a Symbol
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a Symbol,
   *                   otherwise false.
   */
  function isSymbol(subject) {
    return typeof subject === $SYMBOLTYPE;
  }

  /**
   * The abstract operation GetMethod is used to get the value of a specific
   * property of an object when the value of the property is expected to be a
   * function.
   *
   * @private
   * @param {object} object
   * @param {string|symbol} property
   * @throws {TypeError} If value of a specific property of an object is not a
   *                     function.
   * @return {function}
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-getmethod
   */
  function $GetMethod(object, property) {
    if ($DEVELOPSTRICT && !isSymbol(property) && !isString(property)) {
      /*jshint newcap:true */
      throw new TypeError('property must be a string or symbol');
    }

    var func = object[property];

    if (!isNil(func) && !isFunction(func)) {
      /*jshint newcap:false */
      throw new $TE('method is not a function');
    }

    return func;
  }

  /**
   * Returns true if the operand inputArg is a String.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  function isString(subject) {
    return $TOSTRINGTAG(subject) === $STRINGTAG;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} Returns `true` if `subject` is array-like, else `false`.
   */
  function isArrayLike(subject) {
    return !isNil(subject) && !isFunction(subject) && isLength(subject.length);
  }

  /**
   * If 'relaxed' is falsy The function tests the subject arguments and returns
   * the Boolean value true if the argument is an object whose class internal
   * property is "Array"; otherwise it returns false. if 'relaxed' is true then
   * 'isArrayLike' is used for the test.
   *
   * @private
   * @param {*} subject The object to be tested.
   * @param {boolean} [relaxed] Use isArrayLike rather than isArray
   * @return {boolean}
   * @see http://www.ecma-international.org/ecma-262/6.0/#sec-isarray
   */
  function isArray(subject, relaxed) {
    var isA;

    if (relaxed) {
      isA = isArrayLike(subject) && !isString(subject);
    } else {
      isA = $ISARRAY(subject);
    }

    return isA;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * @private
   * @param {*} subject The value to check.
   * @return {boolean} Returns `true` if `value` is a valid length,
   *                   else `false`.
   */
  function isLength(subject) {
    return $ToSafeInteger(subject) === subject && subject >= 0;
  }

  /**
   * Get the last index of an array-like object.
   *
   * @private
   * @param {*} subject The object to get the last index of.
   * @return {number} Returns the last index number of the array.like or 0.
   */
  function lastIndex(subject) {
    return isArrayLike(subject) && $ToSafeInteger(subject.length - 1) || 0;
  }

  /**
   * Tests if the two character arguments combined are a valid UTF-16 surrogate
   * pair.
   *
   * @private
   * @param {*} char1 The first character of a suspected surrogate pair.
   * @param {*} char2 The second character of a suspected surrogate pair.
   * @return {number} Returns true if the two characters create a valid UTF-16
   *                  surrogate pair; otherwise false.
   */
  function isSurrogatePair(char1, char2) {
    var result = false,
      code1,
      code2;

    if (char1 && char2 && isString(char1) && isString(char2)) {
      code1 = char1.charCodeAt();
      if (code1 >= 0xD800 && code1 <= 0xDBFF) {
        code2 = char2.charCodeAt();
        if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
          result = true;
        }
      }
    }

    return result;
  }

  function set(object, key, value, mapFn, thisArg) {
    if (mapFn) {
      object[key] = mapFn.call(thisArg, value, key);
    } else {
      object[key] = value;
    }
  }

  /**
   * Returns true if the operand subject is an Object.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  /*
  function isObject(subject) {
    return $O(subject) === subject;
  }
  */

  /*
  setProperty($E, 'enslave', function (subject, name, staticMethod, generator) {
    if (!isObject(subject)) {
      throw new $TE('subject must be an object');
    }

    if (!isFunction(staticMethod)) {
      throw new $TE('method must be a function');
    }

    var object;

    if (!isNil(generator)) {
      if (!isFunction(generator)) {
        throw new $TE('generator must be a function');
      }

      object = generator(subject);
    } else {
      object = subject;
    }

    setProperty(subject, name, staticMethod.bind(undefined, object));
  });
  */

  /*
  setProperty($E, 'appoint', function (subject, name, prototypeMethod) {
    if (!isObject(subject)) {
      throw new $TE('subject must be an object');
    }

    if (!isFunction(prototypeMethod)) {
      throw new $TE('prototypeMethod must be a function');
    }

    setProperty(subject, name, prototypeMethod);
  });
  */

  /*
  function entriesKey(item) {
    return $ToObject(item)[0];
  }

  setProperty($E, 'entriesKey', entriesKey);

  function entriesValue(item) {
    return $ToObject(item)[1];
  }

  setProperty($E, 'entriesValue', entriesValue);
  */

  function checkcallback(callback) {
    if (!isFunction(callback)) {
      /*jshint newcap:false */
      throw new $TE('callback must be a function');
    }
  }

  /*
   * define iterators
   */

  function iterartorNotReversable() {
    /*jshint newcap:false */
    return new $TE('Iterator is not reversable.');
  }

  function defineIterator(object) {
    return $GetMethod($DEFINEPROPERTY(object, $SI, $METHODDESCRIPTOR), $SI)();
  }

  function defineReverse(iterator, flags) {
    $METHODDESCRIPTOR.value = function () {
      if (flags.started) {
        throw iterartorNotReversable();
      }

      flags.reversed = true;
      delete iterator.reverse;

      return iterator;
    };

    $DEFINEPROPERTY(iterator, 'reverse', $METHODDESCRIPTOR);

    return iterator;
  }

  function defineValuesAndKeys(iterator, flags) {
    $METHODDESCRIPTOR.value = function () {
      flags.values = true;
      delete iterator.values;
      delete iterator.keys;

      return iterator;
    };

    $DEFINEPROPERTY(iterator, 'values', $METHODDESCRIPTOR);

    $METHODDESCRIPTOR.value = function () {
      flags.keys = true;
      delete iterator.keys;
      delete iterator.values;

      return iterator;
    };

    $DEFINEPROPERTY(iterator, 'keys', $METHODDESCRIPTOR);

    return iterator;
  }

  function defineReverseOnly(object, flags) {
    return defineReverse(defineIterator(object), flags);
  }

  function defineAll(object, flags) {
    return defineValuesAndKeys(defineReverseOnly(object, flags), flags);
  }

  /*
   * counter
   */

  function Counter(start, end) {
    /*jshint validthis:true */
    if (!(this instanceof Counter)) {
      return new Counter(start, end);
    }

    start = $ToSafeInteger(start);
    end = $ToSafeInteger(end);

    var from = $MIN(start, end),
      to = $MAX(start, end),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* CountIterator() {
      if (flags.reversed) {
        while (to >= from) {
          yield to;
          to -= 1;
        }
      } else {
        flags.started = true;
        while (from <= to) {
          yield from;
          from += 1;
        }
      }
    };

    /*jshint validthis:true */
    return defineReverseOnly(this, flags);
  }

  setProperty($E, 'counter', Counter);

  /*
   * arrayEntries
   */

  function ArrayEntries(subject) {
    /*jshint validthis:true */
    if (!(this instanceof ArrayEntries)) {
      return new ArrayEntries(subject);
    }

    var object = $ToObject(subject),
      flags = {
        values: false,
        keys: false,
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ArrayIterator() {
      var countIt = new Counter(lastIndex(object)),
        value,
        key;

      if (flags.reversed) {
        countIt = countIt.reverse();
      }

      flags.started = true;
      for (key of countIt) {
        if (flags.keys) {
          yield key;
        } else {
          value = object[key];
          if (flags.values) {
            yield value;
          } else {
            yield [key, value];
          }
        }
      }
    };

    /*jshint validthis:true */
    return defineAll(this, flags);
  }

  setProperty($E.Array, 'entries', ArrayEntries);

  /*
   * stringEntries
   */

  function getStringEntriesYield(string, key, flags) {
    var value,
      result;

    if (flags.keys) {
      result = key;
    } else {
      value = $FROMCODEPOINT(string.codePointAt(key));
      if (flags.values) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function StringEntries(subject) {
    /*jshint validthis:true */
    if (!(this instanceof StringEntries)) {
      return new StringEntries(subject);
    }

    var string = $OnlyCoercibleToString(subject),
      flags = {
        values: false,
        keys: false,
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* StringIterator() {
      var countIt = new Counter(lastIndex(string)),
        next = true,
        key;

      flags.started = true;
      if (flags.reversed) {
        for (key of countIt.reverse()) {
          if (next) {
            next = !isSurrogatePair(string[key - 1], string[key]);
            if (next) {
              yield getStringEntriesYield(string, key, flags);
            }
          } else {
            next = !next;
            yield getStringEntriesYield(string, key, flags);
          }
        }
      } else {
        for (key of countIt) {
          if (next) {
            next = !isSurrogatePair(string[key], string[key + 1]);
            yield getStringEntriesYield(string, key, flags);
          } else {
            next = !next;
          }
        }
      }
    };

    /*jshint validthis:true */
    return defineAll(this, flags);
  }

  setProperty($E.String, 'entries', StringEntries);

  /*
   * enumerate
   */

  function Enumerate(subject) {
    /*jshint validthis:true */
    if (!(this instanceof Enumerate)) {
      return new Enumerate(subject);
    }

    var object = $OnlyCoercibleToString(subject),
      flags = {
        started: true,
        values: false,
        keys: false
      };

    $METHODDESCRIPTOR.value = function* ObjectEnumerator() {
      var value,
        key;

      for (key in object) {
        if (flags.keys) {
          yield key;
        } else {
          value = object[key];
          if (flags.values) {
            yield value;
          } else {
            yield [key, value];
          }
        }
      }
    };

    /*jshint validthis:true */
    return defineAll(this, flags);
  }

  setProperty($E.Object, 'enumerate', Enumerate);

  /*
   * objectKeys
   */

  function ObjectKeys(subject) {
    /*jshint validthis:true */
    if (!(this instanceof ObjectKeys)) {
      return new ObjectKeys(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var keysIt = new ArrayEntries($OBJECTKEYS(object)).values();

      if (flags.reversed) {
        keysIt = keysIt.reverse();
      }

      flags.started = true;
      yield * keysIt;
    };

    /*jshint validthis:true */
    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'keys', ObjectKeys);

  /*
   * getOwnPropertyNames
   */

  function GetOwnPropertyNames(subject) {
    /*jshint validthis:true */
    if (!(this instanceof GetOwnPropertyNames)) {
      return new GetOwnPropertyNames(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var namesIt = new ArrayEntries($GOPN(object)).values();

      if (flags.reversed) {
        namesIt = namesIt.reverse();
      }

      flags.started = true;
      yield * namesIt;
    };

    /*jshint validthis:true */
    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'getOwnPropertyNames', GetOwnPropertyNames);

  /*
   * getOwnPropertySymbols
   */

  function GetOwnPropertySymbols(subject) {
    /*jshint validthis:true */
    if (!(this instanceof GetOwnPropertySymbols)) {
      return new GetOwnPropertySymbols(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var symbolsIt = new ArrayEntries($GOPS(object)).values();

      if (flags.reversed) {
        symbolsIt = symbolsIt.reverse();
      }

      flags.started = true;
      yield * symbolsIt;
    };

    /*jshint validthis:true */
    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'getOwnPropertySymbols', GetOwnPropertySymbols);

  /*
   * ownKeys
   */

  function OwnKeys(subject) {
    /*jshint validthis:true */
    if (!(this instanceof OwnKeys)) {
      return new OwnKeys(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var namesIt = new GetOwnPropertyNames(object),
        symbolsIt = new GetOwnPropertySymbols(object);

      if (flags.reversed) {
        namesIt = namesIt.reverse();
        symbolsIt = symbolsIt.reverse();
      }

      flags.started = true;
      yield * namesIt;
      yield * symbolsIt;
    };

    /*jshint validthis:true */
    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'ownKeys', OwnKeys);

  /*
   * unique
   */

  function* unique(subject) {
    var object = $ToObject(subject),
      seen = new Set(),
      item,
      value;

    for (item of object) {
      value = item;
      if (!seen.has(value)) {
        seen.add(value, true);
        yield item;
      }
    }
  }

  setProperty($E.Object, 'unique', unique);

  /*
   * flatten
   */

  function* flatten(subject, relaxed) {
    var object = $ToObject(subject),
      stack,
      value,
      tail;

    if (!isArray(object, relaxed)) {
      return;
    }

    stack = new Map();
    stack.set(object, {
      index: 0,
      prev: null
    });

    while (stack.size) {
      tail = stack.get(object);
      if (tail.index >= object.length) {
        stack.delete(object);
        object = tail.prev;
      } else {
        value = object[tail.index];
        if (isArray(value, relaxed)) {
          if (stack.has(value)) {
            /*jshint newcap:false */
            throw new $TE('Flattening circular array');
          }

          stack.set(value, {
            index: 0,
            prev: object
          });

          object = value;
        } else {
          yield value;
        }

        tail.index += 1;
      }
    }
  }

  setProperty($E.Array, 'flatten', flatten);

  /*
   * map
   */

  setProperty($E.Object, 'map', function* (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    checkcallback(callback);
    index = 0;
    for (element of object) {
      yield callback.call(thisArg, element, index, object);
      index += 1;
    }
  });

  /*
   * filter
   */

  setProperty($E.Object, 'filter', function* (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    checkcallback(callback);
    index = 0;
    for (element of object) {
      if (callback.call(thisArg, element, index, object)) {
        yield element;
        index += 1;
      }
    }
  });

  /*
   * reduce
   */

  setProperty($E.Object, 'reduce', function (subject, callback, initialValue) {
    var object = $ToObject(subject),
      element,
      index;

    checkcallback(callback);
    index = 0;
    for (element of object) {
      initialValue = callback(initialValue, element, index, object);
      index += 1;
    }

    return initialValue;
  });

  /*
   * forEach
   */

  setProperty($E.Object, 'forEach', function (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    checkcallback(callback);
    index = 0;
    for (element of object) {
      callback.call(thisArg, element, index, object);
      index += 1;
    }
  });

  /*
   * every
   */

  setProperty($E.Object, 'every', function (subject, callback, thisArg) {
    var object = $ToObject(subject),
      result,
      element,
      index;

    checkcallback(callback);
    result = true;
    index = 0;
    for (element of object) {
      if (!callback.call(thisArg, element, index, object)) {
        result = false;
        break;
      }

      index += 1;
    }

    return result;
  });

  /*
   * from
   */

  if (!$ARRAYFROM) {
    $ARRAYFROM = function (items) {
      var object = $ToObject(items),
        mapFn,
        generator,
        thisArg,
        length,
        result,
        index,
        value;

      if (arguments.length > 1) {
        mapFn = arguments[1];
        if (!isFunction(mapFn)) {
          /*jshint newcap:false */
          throw new $TE('If provided, the second argument must be a function');
        }

        if (arguments.length > 2) {
          thisArg = arguments[2];
        }
      }

      generator = $GetMethod(object, $SI);
      index = 0;
      if (isFunction(generator)) {
        /*jshint validthis:true */
        result = isFunction(this) ? $O(new this()) : [];
        for (value of object) {
          set(result, index, value, mapFn, thisArg);
          index += 1;
        }
      } else {
        length = $ToLength(object.length);
        /*jshint validthis:true */
        result = isFunction(this) ? $O(new this(length)) : new $A(length);
        while (index < length) {
          value = object[index];
          set(result, index, value, mapFn, thisArg);
          index += 1;
        }

        result.length = length;
      }

      return result;
    };
  }

  setProperty($E.Array, 'from', $ARRAYFROM);

  return $E;
}));
