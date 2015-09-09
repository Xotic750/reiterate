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

  var $SY = Symbol,
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
      if ($APU && object === $AP) {
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
    var number = +inputArg,
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

  function $ToLength(inputArg) {
    return clamp($ToInteger(inputArg), 0, $MAX_SAFE_INTEGER);
  }

  function $ToSafeInteger(inputArg) {
    return clamp($ToInteger(inputArg), $MIN_SAFE_INTEGER, $MAX_SAFE_INTEGER);
  }

  function isSurrogatePair(char1, char2) {
    var result = false,
      code1,
      code2;

    if (char1 && char2) {
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
    var from = $ToSafeInteger(start),
      to = $ToSafeInteger(end);

    while (from <= to) {
      yield from;
      from += 1;
    }
  });

  setProperty($N, 'countDown', function* (start, end) {
    var from = $ToSafeInteger(start),
      to = $ToSafeInteger(end);

    while (from >= to) {
      yield from;
      from -= 1;
    }
  });

  setProperty($AP, 'values', $AP[$SI]);

  setProperty($AP, 'reverseKeys', function* reversArrayKeys() {
    var object = $ToObject(this),
      key;

    for (key of $N.countDown(object.length - 1, 0)) {
      yield key;
    }
  });

  setProperty($AP, 'reverseValues', function* () {
    var object = $ToObject(this),
      key;

    for (key of object.keys()) {
      yield object[key];
    }
  });

  setProperty($AP, 'reverseEntries', function* () {
    var object = $ToObject(this),
      key;

    for (key of object.keys()) {
      yield [key, object[key]];
    }
  });

  setProperty($SP, 'keys', function* () {
    var string = $OnlyCoercibleToString(this),
      next = true,
      key;

    for (key of $N.countUp(0, string.length - 1)) {
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

    for (key of $N.countDown(string.length - 1, 0)) {
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

  setProperty($O, 'unique', function* (inputArg, valueFunction, thisArg) {
    var object = $ToObject(inputArg),
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

  setProperty($O, 'enumerables', function* (inputArg) {
    var object = $ToObject(inputArg),
      key;

    for (key in object) {
      yield [key, object[key]];
    }
  });

  setProperty($O, 'valuesByKeys', function* (inputArg, keysArray) {
    var object = $ToObject(inputArg),
      key;

    for (key of keysArray) {
      yield [key, object[key]];
    }
  });

  setProperty($O, 'enumerate', function (inputArg, keysFunction, thisArg) {
    var object = $ToObject(inputArg);

    if (isFunction(keysFunction)) {
      return $O.valuesByKeys(object, keysFunction.call(thisArg, object));
    } else {
      return $O.enumerables(object);
    }
  });

  return $EXPORTS;
}));
