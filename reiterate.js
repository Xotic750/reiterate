/*jslint maxlen:80, es6:true, this:true */

/*property
    MAX_SAFE_INTEGER, MIN_SAFE_INTEGER, abs, amd, bind, call, charCodeAt,
    configurable, defineProperties, defineProperty, enumerable, exports, floor,
    fromCodePoint, getOwnPropertyNames, getOwnPropertySymbols, hasOwnProperty,
    isArray, isFinite, isNaN, iterator, keys, length, max, min, prototype,
    reverse, reversed, sign, started, toString, unscopables, value, values,
    writable
*/

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], Function.prototype.call.bind(factory, root));
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(root);
  } else {
    // Browser globals (root is window)
    if (root.hasOwnProperty('reiterate')) {
      throw new Error('Unable to define "reiterate"');
    }

    Object.defineProperty(root, 'reiterate', {
      enumerable: false,
      writable: true,
      configurable: true,
      value: factory(root)
    });
  }
}(this, function (root) {
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
    $HOP = $F.call.bind($OP.hasOwnProperty),
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
    $DEFINEPROPERTIES = $O.defineProperties,
    $OBJECTKEYS = $O.keys,
    $GOPN = $O.getOwnPropertyNames,
    $GOPS = $O.getOwnPropertySymbols,
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
    $TE = TypeError,
    $E = {};

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

  function isNil(subject) {
    return subject == null;
  }

  function $RequireObjectCoercible(subject) {
    if (isNil(subject)) {
      throw new $TE('Cannot convert undefined or null to object');
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
    return clamp($ToInteger(subject), $MIN_SAFE_INTEGER, $MAX_SAFE_INTEGER);
  }

  function isFunction(subject) {
    return typeof subject === $FUNCTIONTYPE;
  }

  function $GetMethod(object, property) {
    var func = object[property],
      result;

    if (!isNil && !isFunction(func)) {
      throw new $TE('method is not a function');
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

  function lastIndex(subject) {
    return isArrayLike(subject) && $ToSafeInteger(subject.length - 1) || 0;
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

  function isObject(subject) {
    return $O(subject) === subject;
  }

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

  function iterartorNotReversable() {
    return new TypeError('Iterator is not reversable.');
  }

  function defineIterator(object) {
    return $DEFINEPROPERTY(object, $SI, $METHODDESCRIPTOR)[$SI]();
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

  function counter(start, end) {
    if (!(this instanceof counter)) {
      return new counter(start, end);
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

    return defineReverseOnly(this, flags);
  }

  setProperty($E, 'counter', counter);

  /*
   * arrayEntries
   */

  function arrayEntries(subject) {
    if (!(this instanceof arrayEntries)) {
      return new arrayEntries(subject);
    }

    var object = $ToObject(subject),
      flags = {
        values: false,
        keys: false,
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ArrayIterator() {
      var countIt = counter(lastIndex(string)),
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

    return defineAll(this, flags);
  }

  setProperty($E.Array, 'entries', arrayEntries);

  /*
   * stringEntries
   */

  function stringEntries(subject) {
    if (!(this instanceof stringEntries)) {
      return new stringEntries(subject);
    }

    var string = $OnlyCoercibleToString(subject),
      flags = {
        values: false,
        keys: false,
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* StringIterator() {
      var countIt = counter(lastIndex(string)),
        next = true,
        value,
        key;

      if (flags.reversed) {
        countIt = countIt.reverse();
      }

      flags.started = true;
      for (key of countIt) {
        if (next) {
          next = !isSurrogatePair(string[key], string[key + 1]);
          if (flags.keys) {
            yield key;
          } else {
            value = $FROMCODEPOINT(string.codePointAt(key));
            if (flags.values) {
              yield value;
            } else {
              yield [key, value];
            }
          }
        } else {
          next = !next;
        }
      }
    };

    return defineAll(this, flags);
  }

  setProperty($E.String, 'entries', stringEntries);

  /*
   * unique
   */

  setProperty($E, 'unique', function* (subject) {
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
  });

  /*
   * enumerate
   */

  function enumerate(subject) {
    if (!(this instanceof enumerate)) {
      return new enumerate(subject);
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

    return defineAll(this, flags);
  }

  setProperty($E.Object, 'enumerate', enumerate);

  function objectKeys(subject) {
    if (!(this instanceof objectKeys)) {
      return new objectKeys(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var keysIt = arrayValues($OBJECTKEYS(object));

      if (flags.reversed) {
        keysIt = keysIt.reverse();
      }

      flags.started = true;
      yield * keysIt;
    };

    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'keys', objectKeys);

  function getOwnPropertyNames(subject) {
    if (!(this instanceof getOwnPropertyNames)) {
      return new getOwnPropertyNames(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var namesIt = arrayValues($GOPN(object));

      if (flags.reversed) {
        namesIt = namesIt.reverse();
      }

      flags.started = true;
      yield * namesIt;
    };

    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'getOwnPropertyNames', getOwnPropertyNames);

  function getOwnPropertySymbols(subject) {
    if (!(this instanceof getOwnPropertySymbols)) {
      return new getOwnPropertySymbols(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var symbolsIt = arrayValues($GOPS(object));

      if (flags.reversed) {
        symbolsIt = symbolsIt.reverse();
      }

      flags.started = true;
      yield * symbolsIt;
    };

    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'getOwnPropertySymbols', getOwnPropertySymbols);

  function ownKeys(subject) {
    if (!(this instanceof ownKeys)) {
      return new ownKeys(subject);
    }

    var object = $ToObject(subject),
      flags = {
        started: false,
        reversed: false
      };

    $METHODDESCRIPTOR.value = function* ObjectIterator() {
      var namesIt = getOwnPropertyNames(object),
        symbolsIt = getOwnPropertySymbols(object);

      if (flagsreversed) {
        namesIt = namesIt.reverse();
        symbolsIt = symbolsIt.reverse();
      }

      flags.started = true;
      yield * namesIt;
      yield * symbolsIt;
    };

    return defineReverseOnly(this, flags);
  }

  setProperty($E.Object, 'ownKeys', ownKeys);

  /*
   * flatten
   */

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
        throw new $TE('When provided, the second argument must be a function');
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

  setProperty($E, 'map', function* (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    if (!isFunction(callback)) {
      throw new $TE('callback must be a function');
    }

    index = 0;
    for (element of object) {
      yield callback.call(thisArg, element, index, object);
      index += 1;
    }
  });

  setProperty($E, 'filter', function* (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    if (!isFunction(callback)) {
      throw new $TE('callback must be a function');
    }

    index = 0;
    for (element of object) {
      if (callback.call(thisArg, element, index, object)) {
        yield element;
        index += 1;
      }
    }
  });

  setProperty($E, 'reduce', function (subject, callback, initialValue) {
    var object = $ToObject(subject),
      element,
      index;

    if (!isFunction(callback)) {
      throw new $TE('callback must be a function');
    }

    index = 0;
    for (element of object) {
      initialValue = callback(initialValue, element, index, object);
      index += 1;
    }

    return initialValue;
  });

  setProperty($E, 'forEach', function (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    if (!isFunction(callback)) {
      throw new $TE('callback must be a function');
    }

    index = 0;
    for (element of object) {
      callback.call(thisArg, element, index, object);
      index += 1;
    }
  });

  setProperty($E, 'every', function (subject, callback, thisArg) {
    var object = $ToObject(subject),
      element,
      index;

    if (!isFunction(callback)) {
      throw new $TE('callback must be a function');
    }

    index = 0;
    for (element of object) {
      if (!callback.call(thisArg, element, index, object)) {
        return false;
        break;
      }

      index += 1;
    }

    return true;
  });

  return $E;
}));
