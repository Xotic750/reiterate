/*jslint maxlen:80, es6:true, this:true */

/*property
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, abs, amd, charCodeAt, configurable,
    defineProperty, enumerable, exports, floor, fromCodePoint,
    getOwnPropertyDescriptor, hasOwnProperty, isFinite, isNaN, iterator, max,
    min, prototype, sign, unscopables, value, writable
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
    Object.defineProperty(root, 'returnExports', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: factory()
    });
  }
}(this, function () {
  'use strict';

  const $SY = Symbol,
    $SU = $SY.unscopables,
    $SI = $SY.iterator,
    $O = Object,
    $A = Array,
    $AP = $A.prototype,
    $APU = $AP[$SU],
    $S = String,
    $SP = $S.prototype,
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
    $METHODDESCRIPTOR = $O.getOwnPropertyDescriptor($AP, 'push'),
    $EXPORTS = {};

  function setProperty(object, property, value) {
    if (!object.hasOwnProperty(property)) {
      $METHODDESCRIPTOR.value = value;
      $DEFINEPROPERTY(object, property, $METHODDESCRIPTOR);
      if (object === $AP) {
        $APU[property] = true;
      }
    }
  }

  function $RequireObjectCoercible(inputArg) {
    if (inputArg == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    return inputArg;
  }

  function $ToObject(inputArg) {
    return $O($RequireObjectCoercible(inputArg));
  }

  function $OnlyCoercibleToString(inputArg) {
    return $S($RequireObjectCoercible(inputArg));
  }

  function $ToInteger(inputArg) {
    const number = +inputArg;
    let val = 0;

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

  function $ToLength(inputArg) {
    return clamp($ToInteger(inputArg), 0, $MAX_SAFE_INTEGER);
  }

  function $ToSafeInteger(inputArg) {
    return clamp($ToInteger(inputArg), $MIN_SAFE_INTEGER, $MAX_SAFE_INTEGER);
  }

  function isSurrogatePair(char1, char2) {
    if (char1 && char2) {
      let code1 = char1.charCodeAt();
      if (code1 >= 0xD800 && code1 <= 0xDBFF) {
        let code2 = char2.charCodeAt();
        if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
          return true;
        }
      }
    }

    return false;
  }

  function isFunction(inputArg) {
    return typeof inputArg === 'function';
  }

  setProperty($A, 'entriesKey', function (item) {
    return $ToObject(item)[0];
  });

  setProperty($A, 'entriesValue', function (item) {
    return $ToObject(item)[1];
  });

  setProperty($N, 'countUp', function* countUp(start, end) {
    let from = $ToSafeInteger(start);
    const to = $ToSafeInteger(end);

    while (from <= to) {
      yield from;
      from += 1;
    }
  });

  setProperty($N, 'countDown', function* (start, end) {
    let from = $ToSafeInteger(start);
    const to = $ToSafeInteger(end);

    while (from >= to) {
      yield from;
      from -= 1;
    }
  });

  setProperty($AP, 'values', $AP[$SI]);

  setProperty($AP, 'reverseKeys', function* reversArrayKeys() {
    const object = $ToObject(this);

    for (let key of $N.countDown(object.length - 1, 0)) {
      yield key;
    }
  });

  setProperty($AP, 'reverseValues', function* () {
    const object = $ToObject(this);

    for (let key of object.keys()) {
      yield object[key];
    }
  });

  setProperty($AP, 'reverseEntries', function* () {
    const object = $ToObject(this);

    for (let key of object.keys()) {
      yield [key, object[key]];
    }
  });

  setProperty($SP, 'keys', function* () {
    const string = $OnlyCoercibleToString(this);
    let next = true;

    for (let key of $N.countUp(0, string.length - 1)) {
      if (next) {
        next = !isSurrogatePair(string[key], string[key + 1]);
        yield key;
      } else {
        next = !next;
      }
    }
  });

  setProperty($SP, 'values', function () {
    return $OnlyCoercibleToString(this)[Symbol.iterator]();
  });

  setProperty($SP, 'entries', function* () {
    const string = $OnlyCoercibleToString(this);

    for (let key of string.keys()) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  setProperty($SP, 'reverseKeys', function* () {
    const string = $OnlyCoercibleToString(this);
    let next = true;

    for (let key of $N.countDown(string.length - 1, 0)) {
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
    const string = $OnlyCoercibleToString(this);

    for (let key of string.reverseKeys()) {
      yield $FROMCODEPOINT(string.codePointAt(key));
    }
  });

  setProperty($SP, 'reverseEntries', function* () {
    const string = $OnlyCoercibleToString(this);

    for (let key of string.reverseKeys()) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  setProperty($O, 'unique', function* (inputArg, valueFunction, thisArg) {
    const object = $ToObject(inputArg),
      isFn = isFunction(valueFunction),
      seen = new Set();

    for (let item of object) {
      const value = isFn ? valueFunction.call(thisArg, item) : item;
      if (!seen.has(value)) {
        seen.add(value, true);
        yield item;
      }
    }
  });

  setProperty($O, 'enumerables', function* (inputArg) {
    const object = $ToObject(inputArg);

    for (let key in object) {
      yield [key, object[key]];
    }
  });

  setProperty($O, 'valuesByKeys', function* (inputArg, keysArray) {
    const object = $ToObject(inputArg);

    for (let key of keysArray) {
      yield [key, object[key]];
    }
  });

  setProperty($O, 'enumerate', function (inputArg, keysFunction, thisArg) {
    const object = $ToObject(inputArg);

    if (isFunction(keysFunction)) {
      return $O.valuesByKeys(object, keysFunction.call(thisArg, object));
    } else {
      return $O.enumerables(object);
    }
  });

  return $EXPORTS;
}));
