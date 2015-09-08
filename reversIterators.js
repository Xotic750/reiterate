/*jslint maxlen:80, es6:true, this:true */

/*property
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, abs, amd, charCodeAt, defineProperty,
    exports, floor, fromCodePoint, getOwnPropertyDescriptor, isFinite, isNaN,
    iterator, max, min, prototype, returnExports, sign, unscopables
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
    root.returnExports = factory();
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
    $FROMCODEPOINT = $S.fromCodePoint;

  let property = 'push',
    methodDescriptor = $O.getOwnPropertyDescriptor($AP, property);

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

  property = 'values';
  if (!$AP.hasOwnProperty(property)) {
    methodDescriptor.value = $AP[$SI];
    $DEFINEPROPERTY($AP, property, methodDescriptor);
    $APU[property] = true;
  }

  function* reversArrayKeys(inputArg) {
    for (let key of countDown(inputArg.length - 1, 0)) {
      yield key;
    }
  }

  property = 'reverseKeys';
  if (!$AP.hasOwnProperty(property)) {
    methodDescriptor.value = function () {
      return reversArrayKeys($ToObject(this));
    };

    $DEFINEPROPERTY($AP, property, methodDescriptor);
    $APU[property] = true;
  }

  property = 'reverseValues';
  if (!$AP.hasOwnProperty(property)) {
    methodDescriptor.value = function* () {
      const object = $ToObject(this);

      for (let key of reversArrayKeys(object)) {
        yield object[key];
      }
    };

    $DEFINEPROPERTY($AP, property, methodDescriptor);
    $APU[property] = true;
  }

  property = 'reverseEntries';
  if (!$AP.hasOwnProperty(property)) {
    methodDescriptor.value = function* () {
      const object = $ToObject(this);

      for (let key of reversArrayKeys(object)) {
        yield [key, object[key]];
      }
    };

    $DEFINEPROPERTY($AP, property, methodDescriptor);
    $APU[property] = true;
  }

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

  property = 'keys';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function () {
      return stringKeys($onlyCoercibleToString(this));
    };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

  property = 'values';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function () {
        return $onlyCoercibleToString(this)[Symbol.iterator]();
      };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

  property = 'entries';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function* () {
      const string = $onlyCoercibleToString(this);

      for (let key of stringKeys(string)) {
        yield [key, $FROMCODEPOINT(string.codePointAt(key))];
      }
    };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

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

  property = 'reverseKeys';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function () {
      return reverseStringKeys(onlyCoercibleToString(this));
    };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

  property = 'reverseValues';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function* () {
      const string = $onlyCoercibleToString(this);

      for (let key of reverseStringKeys(string)) {
        yield $FROMCODEPOINT(string.codePointAt(key));
      }
    };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

  property = 'reverseEntries';
  if (!$SP.hasOwnProperty(property)) {
    methodDescriptor.value = function* () {
      const string = $onlyCoercibleToString(this);

      for (let key of reverseStringKeys(string)) {
        yield [key, $FROMCODEPOINT(string.codePointAt(key))];
      }
    };

    $DEFINEPROPERTY($SP, property, methodDescriptor);
  }

  return {
    countUp: countUp,
    countDown: countDown
  };
}));

console.log([Array]);

var a = ['a', 'b', 'c'];

for (var x of a.keys()) {
  console.log(x);
}

console.log('');
for (var x of a.values()) {
  console.log(x);
}

console.log('');
for (var x of a.entries()) {
  console.log(x);
}

console.log('');
for (var x of a.reverseKeys()) {
  console.log(x);
}

console.log('');
for (var x of a.reverseValues()) {
  console.log(x);
}

console.log('');
for (var x of a.reverseEntries()) {
  console.log(x);
}

var s = 'A\uD835\uDC68B\uD835\uDC69C\uD835\uDC6AD';

console.log('');
for (var c of s.entries()) {
  console.log(c);
}

console.log('');
for (var c of s.reverseEntries()) {
  console.log(c);
}
