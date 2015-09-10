/*jslint maxlen:80, es6:true, this:true */

/*property
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, abs, amd, bind, call, charCodeAt,
    configurable, defineProperty, enumerable, exports, floor, fromCodePoint,
    getOwnPropertyDescriptor, hasOwnProperty, isArray, isFinite, isNaN,
    iterator, length, max, min, prototype, sign, toString, unscopables, value,
    writable
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

  var $SY = Symbol,
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
    $TOSTRINGTAG = $F.call.bind($OP.toString),
    $STRINGTAG = $TOSTRINGTAG($SP),
    $FUNCTIONTYPE = typeof $F,
    $M = Math,
    $FLOOR = $M.floor,
    $ABS = $M.abs,
    $MAX = $M.max,
    $MIN = $M.min,
    $SIGN = $M.sign,
    $N = Number,
    $MIN_SAFE_INTEGER = $N.MIN_SAFE_INTEGER,
    $MAX_SAFE_INTEGER = $N.MAX_SAFE_INTEGER,
    $DEFINEPROPERTY = $O.defineProperty,
    $ISNAN = $N.isNaN,
    $ISFINITE = $N.isFinite,
    $FROMCODEPOINT = $S.fromCodePoint,
    $ISARRAY = $A.isArray,
    $METHODDESCRIPTOR = {
      enumerable: false,
      writable: true,
      configurable: true,
      value: undefined
    },
    $T = TypeError,
    $EXPORTS = {};

  function setProperty(object, property, value) {
    if (!object.hasOwnProperty(property)) {
      $METHODDESCRIPTOR.value = value;
      $DEFINEPROPERTY(object, property, $METHODDESCRIPTOR);
      if ($APU && object === $AP) {
        $APU[property] = true;
      }
    }

    return value;
  }

  function isNil(subject) {
    return subject == null;
  }

  function $RequireObjectCoercible(subject) {
    if (isNil(subject)) {
      throw new $T('Cannot convert undefined or null to object');
    }

    return subject;
  }

  function $ToObject(subject) {
    return $O($RequireObjectCoercible(subject));
  }

  function $OnlyCoercibleToString(subject) {
    return $S($RequireObjectCoercible(subject));
  }

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

  function clamp(number, min, max) {
    return $MIN($MAX(number, min), max);
  }

  function $ToLength(subject) {
    return clamp($ToInteger(subject), 0, $MAX_SAFE_INTEGER);
  }

  function $ToSafeInteger(subject) {
    return clamp($ToInteger(subject), $MIN_SAFE_INTEGER, subject);
  }

  function isFunction(subject) {
    return typeof subject === $FUNCTIONTYPE;
  }

  function $GetMethod(object, property) {
    var func = object[property],
      result;

    if (!isNil && !isFunction(func)) {
      throw new $T('method is not a function');
    }

    return func;
  }

  function isString(subject) {
    return $TOSTRINGTAG(subject) === $STRINGTAG;
  }

  function isArrayLike(subject) {
    return !isNil(subject) && !isFunction(subject) && isLength(subject.length);
  }

  function isArray(subject, relaxed) {
    var isA;

    if (relaxed) {
      isA = isArrayLike(subject) && !isString(subject);
    } else {
      isA = $ISARRAY(subject);
    }

    return isA;
  }

  function isLength(subject) {
    return $ToSafeInteger(subject) === subject && subject >= 0;
  }

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

  setProperty($EXPORTS, 'entriesKey', function (item) {
    return $ToObject(item)[0];
  });

  setProperty($EXPORTS, 'entriesValue', function (item) {
    return $ToObject(item)[1];
  });

  function* countUp(start, end) {
    var from = $ToSafeInteger(start),
      to = $ToSafeInteger(end);

    while (from <= to) {
      yield from;
      from += 1;
    }
  }

  setProperty($EXPORTS, 'countUp', countUp);

  function* countDown(start, end) {
    var from = $ToSafeInteger(start),
      to = $ToSafeInteger(end);

    while (from >= to) {
      yield from;
      from -= 1;
    }
  }

  countDown = setProperty($EXPORTS, 'countDown', countDown);

  setProperty($AP, 'values', function* () {
    yield * $ToObject(this);
  });

  setProperty($AP, 'reverseKeys', function* reversArrayKeys() {
    var object = $ToObject(this),
      key;

    for (key of countDown(object.length - 1, 0)) {
      yield key;
    }
  });

  setProperty($AP, 'reverseValues', function* () {
    var object = $ToObject(this),
      key;

    for (key of object.reverseKeys()) {
      yield object[key];
    }
  });

  setProperty($AP, 'reverseEntries', function* () {
    var object = $ToObject(this),
      key;

    for (key of object.reverseKeys()) {
      yield [key, object[key]];
    }
  });

  setProperty($SP, 'keys', function* () {
    var string = $OnlyCoercibleToString(this),
      next = true,
      key;

    for (key of countUp(0, string.length - 1)) {
      if (next) {
        next = !isSurrogatePair(string[key], string[key + 1]);
        yield key;
      } else {
        next = !next;
      }
    }
  });

  setProperty($SP, 'values', function* () {
    yield * $OnlyCoercibleToString(this);
  });

  setProperty($SP, 'entries', function* () {
    var string = $OnlyCoercibleToString(this),
      key;

    for (key of string.keys()) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  setProperty($SP, 'reverseKeys', function* () {
    var string = $OnlyCoercibleToString(this),
      next = true,
      key;

    for (key of countDown(string.length - 1, 0)) {
      if (next) {
        next = !isSurrogatePair(string[key - 1], string[key]);
        if (next) {
          yield key;
        }
      } else {
        next = !next;
        yield key;
      }
    }
  });

  setProperty($SP, 'reverseValues', function* () {
    var string = $OnlyCoercibleToString(this),
      key;

    for (key of string.reverseKeys()) {
      yield $FROMCODEPOINT(string.codePointAt(key));
    }
  });

  setProperty($SP, 'reverseEntries', function* () {
    var string = $OnlyCoercibleToString(this),
      key;

    for (key of string.reverseKeys()) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  setProperty($EXPORTS, 'unique', function* (subject, valueFunction, thisArg) {
    var object = $ToObject(subject),
      isFn = isFunction(valueFunction),
      seen = new Set(),
      item,
      value;

    for (item of object) {
      value = isFn ? valueFunction.call(thisArg, item) : item;
      if (!seen.has(value)) {
        seen.add(value, true);
        yield item;
      }
    }
  });

  function* enumerate(subject) {
    var object = $ToObject(subject),
      key;

    for (key in object) {
      yield [key, object[key]];
    }
  }

  setProperty($EXPORTS, 'enumerate', enumerate);

  setProperty($EXPORTS, 'keys', function* (subject) {
    var object = $ToObject(subject),
      entry;

    for (entry of enumerate(object)) {
      if (object.hasOwnProperty(entry)) {
        yield entry;
      }
    }
  });

  function* ownPropertyNames(subject) {
    var object = $ToObject(subject),
      name;

    for (name of $O.getOwnPropertyNames(object)) {
      yield [name, object[name]];
    }
  }

  setProperty($EXPORTS, 'ownPropertyNames', ownPropertyNames);

  function* ownPropertySymbols(subject) {
    var object = $ToObject(subject),
      symbol;

    for (symbol of $O.getOwnPropertySymbols(object)) {
      yield [symbol, object[symbol]];
    }
  }

  setProperty($EXPORTS, 'ownPropertySymbols', ownPropertySymbols);

  setProperty($EXPORTS, 'ownKeys', function* (subject) {
    yield * ownPropertyNames(subject);
    yield * ownPropertySymbols(subject);
  });

  setProperty($AP, 'flatten', function* (relaxed) {
    var object = $ToObject(this),
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
            throw new TypeError('Flattening circular array');
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
  });

  setProperty($A, 'from', function (items) {
    var object = $ToObject(items),
      mapFn,
      iterator,
      thisArg,
      length,
      result,
      index,
      value;

    if (arguments.length > 1) {
      mapFn = arguments[1];
      if (!isFunction(mapFn)) {
        throw new $T('When provided, the second argument must be a function');
      }

      if (arguments.length > 2) {
        thisArg = arguments[2];
      }
    }

    iterator = $GetMethod(object, $SI);
    index = 0;
    if (iterator) {
      result = isFunction(this) ? $O(new this()) : [];
      for (value of object[$SI]()) {
        set(result, index, value, mapFn, thisArg);
        index += 1;
      }
    } else {
      length = $ToLength(object.length);
      result = isFunction(this) ? $O(new this(length)) : new $A(length);
      while (index < length) {
        value = object[index];
        set(result, index, value, mapFn, thisArg);
        index += 1;
      }

      result.length = length;
    }

    return result;
  });

  return $EXPORTS;
}));