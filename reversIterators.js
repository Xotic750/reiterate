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
    $AP = Array.prototype,
    $APU = $AP[$SU],
    $S = String,
    $SP = $S.prototype,
    $M = Math,
    $FLOOR = $M.floor,
    $ABS = $M.abs,
    $MAX = $M.max,
    $MIN = $M.min,
    $SIGN = $M.sign,
    $NUMBER = Number,
    $MIN_SAFE_INTEGER = $NUMBER.MIN_SAFE_INTEGER,
    $MAX_SAFE_INTEGER = $NUMBER.MAX_SAFE_INTEGER,
    $DEFINEPROPERTY = $O.defineProperty,
    $ISNAN = $NUMBER.isNaN,
    $ISFINITE = $NUMBER.isFinite,
    $FROMCODEPOINT = $S.fromCodePoint,
    $METHODDESCRIPTOR = $O.getOwnPropertyDescriptor($AP, 'push'),
    $EXPORTS = {};

  function setProperty(object, property, value) {
    if (!object.hasOwnProperty(property)) {
      $METHODDESCRIPTOR.value = value;
      $DEFINEPROPERTY(object, property, $METHODDESCRIPTOR);
      if (object === $APU) {
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

  function $onlyCoercibleToString(inputArg) {
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

  function* countUp(start, end) {
    let from = $ToSafeInteger(start);
    const to = $ToSafeInteger(end);

    while (from <= to) {
      yield from;
      from += 1;
    }
  }

  function* countDown(start, end) {
    let from = $ToSafeInteger(start);
    const to = $ToSafeInteger(end);

    while (from >= to) {
      yield from;
      from -= 1;
    }
  }

  setProperty($AP, 'values', $AP[$SI]);

  function* reversArrayKeys(inputArg) {
    for (let key of countDown(inputArg.length - 1, 0)) {
      yield key;
    }
  }

  setProperty($AP, 'reverseKeys', function () {
    return reversArrayKeys($ToObject(this));
  });

  setProperty($AP, 'reverseValues', function* () {
    const object = $ToObject(this);

    for (let key of reversArrayKeys(object)) {
      yield object[key];
    }
  });

  setProperty($AP, 'reverseEntries', function* () {
    const object = $ToObject(this);

    for (let key of reversArrayKeys(object)) {
      yield [key, object[key]];
    }
  });

  function* stringKeys(string) {
    let next = true;

    for (let key of countUp(0, string.length - 1)) {
      if (next) {
        next = !isSurrogatePair(string[key], string[key + 1]);
        yield key;
      } else {
        next = !next;
      }
    }
  }

  setProperty($SP, 'keys', function () {
    return stringKeys($onlyCoercibleToString(this));
  });

  setProperty($SP, 'values', function () {
    return $onlyCoercibleToString(this)[Symbol.iterator]();
  });

  setProperty($SP, 'entries', function* () {
    const string = $onlyCoercibleToString(this);

    for (let key of stringKeys(string)) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  function* reverseStringKeys(string) {
    let next = true;

    for (let key of countDown(string.length - 1, 0)) {
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
  }

  setProperty($SP, 'reverseKeys', function () {
    return reverseStringKeys($onlyCoercibleToString(this));
  });

  setProperty($SP, 'reverseValues', function* () {
    const string = $onlyCoercibleToString(this);

    for (let key of reverseStringKeys(string)) {
      yield $FROMCODEPOINT(string.codePointAt(key));
    }
  });

  setProperty($SP, 'reverseEntries', function* () {
    const string = $onlyCoercibleToString(this);

    for (let key of reverseStringKeys(string)) {
      yield [key, $FROMCODEPOINT(string.codePointAt(key))];
    }
  });

  setProperty($EXPORTS, 'countUp', countUp);
  setProperty($EXPORTS, 'countDown', countDown);

  return $EXPORTS;
}));
