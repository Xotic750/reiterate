(function () {
  'use strict';

  function $requireObjectCoercible(inputArg) {
    if (inputArg == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    return inputArg;
  };

  function $toObject(inputArg) {
    return Object($requireObjectCoercible(inputArg));
  };

  function $toInteger(inputArg) {
    const number = +inputArg;
    let val = 0;

    if (!Number.isNaN(number)) {
      if (!number || number === Infinity || number === -Infinity) {
        val = number;
      } else {
        val = (number > 0 || -1) * Math.floor(Math.abs(number));
      }
    }

    return val;
  };

  function $toLength(inputArg) {
    return Math.min(Math.max($toInteger(inputArg), 0), Number.MAX_SAFE_INTEGER);
  };

  function* reverseKeys(inputArg) {
    let key = $toLength(inputArg.length) - 1;

    while (key >= 0) {
      yield key;
      key -= 1;
    }
  };

  Object.defineProperties(Array.prototype, {
    reverseKeys: {
      value: function () {
        return reverseKeys($toObject(this));
      }
    },

    reverseValues: {
      value: function* () {
        const object = $toObject(this);

        for (let key of reverseKeys(object)) {
          yield object[key];
        }
      }
    },

    reverseEntries: {
      value: function* () {
        const object = $toObject(this);

        for (let key of reverseKeys(object)) {
          yield [key, object[key]];
        }
      }
    }
  });
}());
