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
    configurable, create, defineProperty, enumerable, exports, floor, for,
    fromCodePoint, hasOwnProperty, isArray, isFinite, isNaN, keys, length, max,
    min, prototype, sign, toString, unscopables, value, writable
*/

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
;(function (root, factory) {
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

  var $SY = Symbol,
    $SU = $SY.unscopables,
    $SF = $SY.for,
    $O = Object,
    $OP = $O.prototype,
    $OK = $O.keys,
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
    $UNDEFINEDTYPE = typeof undefined,
    $M = Math,
    $FLOOR = $M.floor,
    $ABS = $M.abs,
    $MAX = $M.max,
    $MIN = $M.min,
    $SIGN = $M.sign,
    $MIN_SAFE_INTEGER = $N.MIN_SAFE_INTEGER,
    $MAX_SAFE_INTEGER = $N.MAX_SAFE_INTEGER,
    $DEFINEPROPERTY = $O.defineProperty,
    $CREATE = $O.create,
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
        value: false
      },
      value: {
        enumerable: true,
        writable: true,
        configurable: false,
        value: undefined
      }
    }),
    $VARIABLEDESCRIPTOR = $CREATE(null, {
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
        value: false
      },
      value: {
        enumerable: true,
        writable: true,
        configurable: false,
        value: undefined
      }
    }),
    $TE = TypeError,
    $ENTRIES = $SF('entries'),
    $KEYS = $SF('keys'),
    $VALUES = $SF('values'),
    $STARTED = $SF('started'),
    $REVERSED = $SF('reversed'),
    $FROM = $SF('from'),
    $TO = $SF('to'),
    $BY = $SF('by'),
    $E = {};

  /*
   * utils
   */

  function setProperty(object, property, descriptor) {
    $DEFINEPROPERTY(object, property, descriptor);
  }

  function setMethod(object, property, method) {
    if (!$HOP(object, property)) {
      $METHODDESCRIPTOR.value = method;
      setProperty(object, property, $METHODDESCRIPTOR);
      if ($APU && object === $AP) {
        $APU[property] = true;
      }
    }

    return method;
  }

  function setVariable(object, property, value) {
    $VARIABLEDESCRIPTOR.value = value;
    setProperty(object, property, $VARIABLEDESCRIPTOR);

    return value;
  }

  setMethod($E, 'Array', {});
  setMethod($E, 'String', {});
  setMethod($E, 'Object', {});

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
  /*
  function $ToLength(subject) {
    return clamp($ToInteger(subject), 0, $MAX_SAFE_INTEGER);
  }
  */

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
   * Returns true if the operand subject is undefined
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is undefined, otherwise false.
   */
  function isUndefined(subject) {
    return typeof subject === $UNDEFINEDTYPE;
  }

  /**
   * Returns true if the operand subject is a Function
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a function, otherwise false.
   */
  function isFunction(subject) {
    return typeof subject === $FUNCTIONTYPE;
  }

  /**
   * Returns true if the operand subject is a Symbol
   *
   * @private
   * @param {*} subject The object to be tested.
   * @return {boolean} True if the object is a Symbol, otherwise false.
   */
  /*
  function isSymbol(subject) {
    return typeof subject === $SYMBOLTYPE;
  }
  */

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

  /**
   * Returns true if the operand subject is an Object.
   *
   * @private
   * @param {*} subject
   * @return {boolean}
   */
  function isObject(subject) {
    return $O(subject) === subject;
  }

  function checkcallback(callback) {
    if (!isFunction(callback)) {
      /*jshint newcap:false */
      throw new $TE('callback must be a function');
    }
  }

  /*
   * define iterators
   */

  /*
   * toArray
   */

  function toArray(mapFn, thisArg) {
    var result,
      item;

    if (!isUndefined(mapFn) && !isFunction(mapFn)) {
      /*jshint newcap:false */
      throw new $TE('If not undefined, the first argument must be a function');
    }

    result = [];
    /*jshint validthis:true */
    for (item of this) {
      result.push(mapFn ? mapFn.call(thisArg, this, item) : item);
    }

    return result;
  }

  /*
   * stringify
   */

  function stringify(mapFn, thisArg) {
    var result,
      item;

    if (!isUndefined(mapFn) && !isFunction(mapFn)) {
      /*jshint newcap:false */
      throw new $TE('If not undefined, the first argument must be a function');
    }

    result = '';
    /*jshint validthis:true */
    for (item of this) {
      result += mapFn ? mapFn.call(thisArg, this, item) : item;
    }

    return result;
  }

  /*
   * unique
   */

  function* unique() {
    /*jshint validthis:true */
    var seen = new Set(),
      item,
      value;

    for (item of this) {
      value = item;
      if (!seen.has(value)) {
        seen.add(value, true);
        yield item;
      }
    }
  }

  setMethod(unique.prototype, 'toArray', toArray);

  /*
   * flatten
   */

  function* flatten(relaxed) {
    /*jshint validthis:true */
    var stack = new Map(),
      object,
      value,
      tail;

    for (object of this) {
      if (isArray(object, relaxed)) {
        stack.set(object, {
          index: 0,
          prev: null
        });
      } else {
        yield object;
      }

      while (stack.size) {
        tail = stack.get(object);
        if (tail.index >= object.length) {
          stack.delete(object);
          object = tail.prev;
        } else {
          value = object[tail.index];
          if (isArray(value, relaxed)) {
            if (stack.has(this) || stack.has(value)) {
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
  }

  setMethod(flatten.prototype, 'toArray', toArray);

  /*
   * walkOwn
   */

  function* walkOwn() {
    /*jshint validthis:true */
    var stack,
      object,
      value,
      tail,
      key;

    stack = new Map();
    for (object of this) {
      if (isObject(object)) {
        stack.set(object, {
          keys: $OK(object),
          index: 0,
          prev: null
        });
      } else {
        yield object;
      }

      while (stack.size) {
        tail = stack.get(object);
        if (tail.index >= tail.keys.length) {
          stack.delete(object);
          object = tail.prev;
        } else {
          key = tail.keys[tail.index];
          value = object[key];
          if (isObject(value)) {
            if (stack.has(this) || stack.has(value)) {
              /*jshint newcap:false */
              throw new $TE('Walking circular object');
            }

            stack.set(value, {
              keys: $OK(value),
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
  }

  setMethod(walkOwn.prototype, 'toArray', toArray);

  function canNotBeChanged(thisObject, name) {
    /*jshint newcap:false */
    if (thisObject[$STARTED]) {
      return new $TE(name + ' can not be changed.');
    }
  }

  /*
  function defineIterator(thisObject, Constructor) {
    $METHODDESCRIPTOR.value = Constructor;
    $DEFINEPROPERTY(thisObject, $SI, $METHODDESCRIPTOR);

    return Constructor.call(thisObject);
  }
  */

  function hideMethod(thisObject, name) {
    if (thisObject[name]) {
      setVariable(thisObject, name, undefined);
    }
  }

  function reverse() {
    /*jshint validthis:true */
    if (this[$STARTED]) {
      /*jshint newcap:false */
      throw new $TE('Iterator is not reversable.');
    }

    hideMethod(this, 'reverse');
    this[$REVERSED] = true;

    return this;
  }

  function entries() {
    /*jshint validthis:true */
    canNotBeChanged(this, 'entries');
    hideMethod(this, 'entries');
    hideMethod(this, 'values');
    hideMethod(this, 'keys');
    this[$ENTRIES] = true;
    this[$KEYS] = false;
    this[$VALUES] = false;

    return this;
  }

  function values() {
    /*jshint validthis:true */
    canNotBeChanged(this, 'values');
    hideMethod(this, 'entries');
    hideMethod(this, 'values');
    hideMethod(this, 'keys');
    this[$ENTRIES] = false;
    this[$KEYS] = false;
    this[$VALUES] = true;

    return this;
  }

  function keys() {
    /*jshint validthis:true */
    canNotBeChanged(this, 'values');
    hideMethod(this, 'entries');
    hideMethod(this, 'values');
    hideMethod(this, 'keys');
    this[$ENTRIES] = false;
    this[$KEYS] = true;
    this[$VALUES] = false;

    return this;
  }

  /*
   * iterator execution
   */

  function getYieldValue(thisObject, object, key) {
    var result,
      value;

    if (thisObject[$KEYS]) {
      result = key;
    } else {
      value = object[key];
      if (thisObject[$VALUES]) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function getStringYieldValue(thisObject, string, key) {
    var value,
      result;

    if (thisObject[$KEYS]) {
      result = key;
    } else {
      value = $FROMCODEPOINT(string.codePointAt(key));
      if (thisObject[$VALUES]) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function then(Generator) {
    /*jshint validthis:true */
    var iterator;

    if (!isFunction(Generator)) {
      if (!isUndefined(Generator)) {
        /*jshint newcap:false */
        throw new $TE('If not undefined, the argument must be a function');
      }

      iterator = this;
    } else {
      iterator = new Generator(this);
      setMethod(iterator, 'then', then);
    }

    setMethod(iterator, 'walkOwn', walkOwn);
    setMethod(iterator, 'toArray', toArray);
    setMethod(iterator, 'unique', unique);
    setMethod(iterator, 'flatten', flatten);

    return iterator;
  }

  /*
   * counter
   */

  function toValidCount(subject) {
    var number = +subject,
      val = 0;

    if (!$ISNAN(number)) {
      val = clamp(number, $MIN_SAFE_INTEGER, $MAX_SAFE_INTEGER);
    }

    return val;
  }

  function from(number) {
    /*jshint validthis:true */
    canNotBeChanged(this, 'from');
    hideMethod(this, 'from');
    this[$FROM] = toValidCount(number);

    return this;
  }

  function to(number) {
    /*jshint validthis:true */
    canNotBeChanged(this, 'to');
    hideMethod(this, 'to');
    this[$TO] = toValidCount(number);

    return this;
  }

  function by(number) {
    /*jshint validthis:true */
    canNotBeChanged(this, 'by');
    hideMethod(this, 'by');
    this[$BY] = $ABS(toValidCount(number));
    if (!this[$BY]) {
      /*jshint newcap:false */
      throw new $TE('can not count by zero');
    }

    return this;
  }

  /*
  function unique() {
    canNotBeChanged(this, 'unique');
    hideMethod(this, 'unique');
    this[$UNIQUE] = true;

    return this;
  }
  */

  function* CountIterator() {
    var count;

    this[$STARTED] = true;
    if (this[$REVERSED]) {
      count = this[$TO];
      if (this[$TO] <= this[$FROM]) {
        while (count <= this[$FROM]) {
          yield count;
          count += this[$BY];
        }
      } else {
        while (count >= this[$FROM]) {
          yield count;
          count -= this[$BY];
        }
      }
    } else {
      count = this[$FROM];
      if (this[$FROM] <= this[$TO]) {
        while (count <= this[$TO]) {
          yield count;
          count += this[$BY];
        }
      } else {
        while (count >= this[$TO]) {
          yield count;
          count -= this[$BY];
        }
      }
    }
  }

  setMethod(CountIterator.prototype, 'from', from);
  setMethod(CountIterator.prototype, 'to', to);
  setMethod(CountIterator.prototype, 'by', by);
  setMethod(CountIterator.prototype, 'reverse', reverse);
  setMethod(CountIterator.prototype, 'toArray', toArray);
  setMethod(CountIterator.prototype, 'then', then);

  function counter() {
    var iterator = new CountIterator();

    setVariable(iterator, $FROM, 0);
    setVariable(iterator, $TO, $MAX_SAFE_INTEGER);
    setVariable(iterator, $BY, 1);
    setVariable(iterator, $REVERSED, false);
    setVariable(iterator, $STARTED, false);

    return iterator;
  }

  setMethod($E, 'counter', counter);

  function defineCommonVariables(iterator) {
    setVariable(iterator, $VALUES, false);
    setVariable(iterator, $KEYS, false);
    setVariable(iterator, $ENTRIES, true);
    setVariable(iterator, $REVERSED, false);
    setVariable(iterator, $STARTED, false);

    return iterator;
  }

  function defineCommonMethods(prototype) {
    setMethod(prototype, 'entries', entries);
    setMethod(prototype, 'keys', keys);
    setMethod(prototype, 'values', values);

    setMethod(prototype, 'toArray', toArray);
    setMethod(prototype, 'then', then);
  }

  function setReversed(thisObject, iterator) {
    if (thisObject[$REVERSED]) {
      iterator.reverse();
    }

    return iterator;
  }

  /*
   * arrayEntries
   */

  function* ArrayIterator(subject) {
    var object = $ToObject(subject),
      countIt = setReversed(this, counter().to(lastIndex(object))),
      key;

    this[$STARTED] = true;
    for (key of countIt) {
      yield getYieldValue(this, object, key);
    }
  }

  defineCommonMethods(ArrayIterator.prototype);
  setMethod(ArrayIterator.prototype, 'reverse', reverse);
  /*
  setMethod(ArrayIterator.prototype, 'flatten', flatten);
  setMethod(ArrayIterator.prototype, 'walkOwn', walkOwn);
  */

  function arrayEntries(subject) {
    var iterator = new ArrayIterator(subject);

    setVariable(iterator, $REVERSED, false);

    return defineCommonVariables(iterator);
  }

  setMethod($E.Array, 'entries', arrayEntries);

  /*
   * stringEntries
   */

  function* StringIterator(subject) {
    var string = $OnlyCoercibleToString(subject),
      countIt = setReversed(this, counter().to(lastIndex(string))),
      //seen = setSeen(this),
      next = true,
      doYield,
      key;

    this[$STARTED] = true;
    for (key of countIt) {
      doYield = false;
      if (next) {
        if (this[$REVERSED]) {
          next = !isSurrogatePair(string[key - 1], string[key]);
          if (next) {
            doYield = true;
          }
        } else {
          next = !isSurrogatePair(string[key], string[key + 1]);
          doYield = true;
        }
      } else {
        next = !next;
        if (this[$REVERSED]) {
          doYield = true;
        }
      }

      if (doYield) {
        yield getStringYieldValue(this, string, key);
      }
    }
  }

  defineCommonMethods(StringIterator.prototype);
  setMethod(StringIterator.prototype, 'reverse', reverse);
  setMethod(StringIterator.prototype, 'stringify', stringify);

  function stringEntries(subject) {
    var iterator = new StringIterator(subject);

    setVariable(iterator, $REVERSED, false);

    return defineCommonVariables(iterator);
  }

  setMethod($E.String, 'entries', stringEntries);

  /*
   * enumerate
   */

  function* ObjectEnumerator(subject) {
    var object = $ToObject(subject),
      key;

    this[$STARTED] = true;
    for (key in object) {
      /*jshint forin:false */
      yield getYieldValue(this, object, key);
    }
  }

  defineCommonMethods(ObjectEnumerator.prototype);
  /*
  setMethod(ObjectEnumerator.prototype, 'flatten', flatten);
  setMethod(ObjectEnumerator.prototype, 'walkOwn', walkOwn);
  */

  function enumerate(subject) {
    return defineCommonVariables(new ObjectEnumerator(subject));
  }

  setMethod($E.Object, 'enumerate', enumerate);

  /*
   * enumerateOwn
   */

  function* ObjectEnumeratorOwn(subject) {
    var object = $ToObject(subject),
      key;

    this[$STARTED] = true;
    for (key in object) {
      if ($HOP(object, key)) {
        yield getYieldValue(this, object, key);
      }
    }
  }

  defineCommonMethods(ObjectEnumeratorOwn.prototype);
  /*
  setMethod(ObjectEnumeratorOwn.prototype, 'flatten', flatten);
  setMethod(ObjectEnumeratorOwn.prototype, 'walkOwn', walkOwn);
  */

  function enumerateOwn(subject) {
    return defineCommonVariables(new ObjectEnumeratorOwn(subject));
  }

  setMethod($E.Object, 'enumerateOwn', enumerateOwn);

  /*
   * map
   */

  setMethod($E.Object, 'map', function* (subject, callback, thisArg) {
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

  setMethod($E.Object, 'filter', function* (subject, callback, thisArg) {
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

  setMethod($E.Object, 'reduce', function (subject, callback, initialValue) {
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

  setMethod($E.Object, 'forEach', function (subject, callback, thisArg) {
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

  setMethod($E.Object, 'every', function (subject, callback, thisArg) {
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

  return $E;
}));
