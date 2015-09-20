/**
 * @file {@link @@HOMEPAGE @@MODULE}. @@DESCRIPTION.
 * @version @@VERSION
 * @author @@AUTHORNAME <@@AUTHOREMAIL>
 * @copyright @@COPYRIGHT @@AUTHORNAME
 * @license {@link <@@LICLINK> @@LICENSE}
 * @module @@MODULE
 */

/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:200,
    maxcomplexity:7
*/

/*global
    define, module
*/

/*property
    ARRAY, BY, ENTRIES, FROM, FUNCTION, KEYS, MAP, MAX_SAFE_INTEGER,
    METHODDESCRIPTOR, MIN_SAFE_INTEGER, NUMBER, OWN, Object, REVERSED, SET,
    STARTED, STRING, STRINGTAG, SYMBOL, TO, TYPE, UNDEFINED, VALUES,
    VARIABLEDESCRIPTOR, abs, amd, bind, call, canNotBeChanged, charCodeAt,
    checkcallback, clamp, configurable, defineProperty, enumerable, exports,
    floor, for, has, hasOwn, hasOwnProperty, hideMethod, isArray, isArrayLike,
    isCircular, isFinite, isFunction, isLength, isNaN, isNil, isNumber,
    isObject, isString, isSurrogatePair, isUndefined, lastIndex, length, max,
    min, mustBeAfunction, prototype, setMethod, setProperty, setVariable, sign,
    toInteger, toSafeInteger, toString, toStringTag, toValidCount, value,
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

  /*
   * const
   */

  var $ = {
      STRINGTAG: {
        ARRAY: Object.prototype.toString.call(Array.prototype),
        MAP: Object.prototype.toString.call(Map.prototype),
        SET: Object.prototype.toString.call(Set.prototype),
        STRING: Object.prototype.toString.call(String.prototype),
        NUMBER: Object.prototype.toString.call(Number.prototype)
      },
      TYPE: {
        FUNCTION: typeof Function,
        UNDEFINED: typeof undefined
      },
      METHODDESCRIPTOR: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: undefined
      },
      VARIABLEDESCRIPTOR: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: undefined
      },
      SYMBOL: {
        ENTRIES: Symbol.for('entries'),
        KEYS: Symbol.for('keys'),
        VALUES: Symbol.for('values'),
        STARTED: Symbol.for('started'),
        REVERSED: Symbol.for('reversed'),
        OWN: Symbol.for('own'),
        FROM: Symbol.for('from'),
        TO: Symbol.for('to'),
        BY: Symbol.for('by')
      }
    },
    _ = {
      hasOwn: Function.call.bind(Object.prototype.hasOwnProperty),

      toStringTag: Function.call.bind(Object.prototype.toString),

      Object: Object,

      setProperty: function (object, property, descriptor) {
        Object.defineProperty(object, property, descriptor);
      },

      setMethod: function (object, property, method) {
        if (_.hasOwn(object, property)) {
          throw new Error('property already exists on object');
        }

        $.METHODDESCRIPTOR.value = method;
        _.setProperty(object, property, $.METHODDESCRIPTOR);

        return method;
      },

      setVariable: function (object, property, value) {
        $.VARIABLEDESCRIPTOR.value = value;
        _.setProperty(object, property, $.VARIABLEDESCRIPTOR);

        return value;
      },

      /**
       * Returns true if the operand inputArg is null or undefined.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isNil: function (subject) {
        /*jshint eqnull:true */
        return subject == null;
      },

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
      /*
      requireObjectCoercible: function (subject) {
        if (_.isNil(subject)) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        return subject;
      },
      */

      /**
       * The abstract operation converts its argument to a value of type Object.
       *
       * @private
       * @param {*} subject
       * @throws {TypeError} If subject is null or undefined.
       * @return {Object}
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-toobject
       */
      /*
      toObject: function (subject) {
        return _.Object(_.requireObjectCoercible(subject));
      },
      */

      /**
       * The function evaluates the passed value and converts it to an integer.
       *
       * @private
       * @param {*} subject The object to be converted to an integer.
       * @return {number} If the target value is NaN, null or undefined, 0 is
       *                  returned. If the target value is false, 0 is returned
       *                  and if true, 1 is returned.
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger
       */
      toInteger: function (subject) {
        var number = +subject,
          val = 0;

        if (!Number.isNaN(number)) {
          if (!number || !Number.isFinite(number)) {
            val = number;
          } else {
            val = Math.sign(number) * Math.floor(Math.abs(number));
          }
        }

        return val;
      },

      /**
       * Returns true if the operand inputArg is a Number.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isNumber: function (subject) {
        return _.toStringTag(subject) === $.STRINGTAG.NUMBER;
      },

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
      clamp: function (number, min, max) {
        if (!_.isNumber(number) || !_.isNumber(min) || !_.isNumber(max)) {
          throw new TypeError('argument is not of type number');
        }
        return Math.min(Math.max(number, min), max);
      },

      /**
       * The function evaluates the passed value and converts it to a safe
       * integer.
       *
       * @private
       * @param {*} subject
       * @return {number}
       */
      toSafeInteger: function (subject) {
        return _.clamp(
          _.toInteger(subject),
          Number.MIN_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER
        );
      },

      /**
       * Returns true if the operand subject is undefined
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is undefined, otherwise false.
       */
      isUndefined: function (subject) {
        return typeof subject === $.TYPE.UNDEFINED;
      },

      /**
       * Returns true if the operand subject is a Function
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} True if the object is a function, otherwise false.
       */
      isFunction: function (subject) {
        return typeof subject === $.TYPE.FUNCTION;
      },

      /**
       * Returns true if the operand inputArg is a String.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isString: function (subject) {
        return _.toStringTag(subject) === $.STRINGTAG.STRING;
      },

      /**
       * Checks if `value` is a valid array-like length.
       *
       * @private
       * @param {*} subject The value to check.
       * @return {boolean} Returns `true` if `value` is a valid length,
       *                   else `false`.
       */
      isLength: function (subject) {
        return _.toSafeInteger(subject) === subject && subject >= 0;
      },

      /**
       * Checks if `value` is array-like. A value is considered array-like if
       * it's  not a function and has a `value.length` that's an integer greater
       * than or equal to `0` and less than or equal to
       * `Number.MAX_SAFE_INTEGER`.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @return {boolean} Returns `true` if `subject` is array-like,
       *                   else `false`.
       */
      isArrayLike: function (subject) {
        return !_.isNil(subject) &&
          !_.isFunction(subject) &&
          _.isLength(subject.length);
      },

      /**
       * If 'relaxed' is falsy The function tests the subject arguments and
       * returns the Boolean value true if the argument is an object whose
       * class internal property is "Array"; otherwise it returns false. if
       * 'relaxed' is true then 'isArrayLike' is used for the test.
       *
       * @private
       * @param {*} subject The object to be tested.
       * @param {boolean} [relaxed] Use isArrayLike rather than isArray
       * @return {boolean}
       * @see http://www.ecma-international.org/ecma-262/6.0/#sec-isarray
       */
      isArray: function (subject, relaxed) {
        var isA;

        if (relaxed) {
          isA = _.isArrayLike(subject) && !_.isString(subject);
        } else {
          isA = Array.isArray(subject);
        }

        return isA;
      },

      /**
       * Get the last index of an array-like object.
       *
       * @private
       * @param {*} subject The object to get the last index of.
       * @return {number} Returns the last index number of the array.like or 0.
       */
      lastIndex: function (subject) {
        return _.isArrayLike(subject) &&
          _.toSafeInteger(subject.length - 1) ||
          0;
      },

      /**
       * Returns true if the operand subject is an Object.
       *
       * @private
       * @param {*} subject
       * @return {boolean}
       */
      isObject: function (subject) {
        return _.Object(subject) === subject;
      },

      /**
       * Returns a string only if the arguments is coercible otherwise throws an
       * error.
       *
       * @private
       * @param {*} subject
       * @throws {TypeError} If subject is null or undefined.
       * @return {string}
       */
      /*
      onlyCoercibleToString: function (subject) {
        return String(_.requireObjectCoercible(subject));
      },
      */

      /**
       * Tests if the two character arguments combined are a valid UTF-16
       * surrogate pair.
       *
       * @private
       * @param {*} char1 The first character of a suspected surrogate pair.
       * @param {*} char2 The second character of a suspected surrogate pair.
       * @return {number} Returns true if the two characters create a valid
       *                  UTF-16 surrogate pair; otherwise false.
       */
      isSurrogatePair: function (char1, char2) {
        var result = false,
          code1,
          code2;

        if (char1 && char2 && _.isString(char1) && _.isString(char2)) {
          code1 = char1.charCodeAt();
          if (code1 >= 0xD800 && code1 <= 0xDBFF) {
            code2 = char2.charCodeAt();
            if (code2 >= 0xDC00 && code2 <= 0xDFFF) {
              result = true;
            }
          }
        }

        return result;
      },

      checkcallback: function (callback) {
        if (!_.isFunction(callback)) {
          throw new TypeError('callback must be a function');
        }

        return callback;
      },

      mustBeAfunction: function (subject, name) {
        if (!_.isUndefined(subject) && !_.isFunction(subject)) {
          throw new TypeError(
            'If not undefined, ' + name + ' must be a function'
          );
        }
      },

      canNotBeChanged: function (thisArg, name) {
        if (thisArg[$.SYMBOL.STARTED]) {
          throw new TypeError(name + ' can not be changed.');
        }
      },

      toValidCount: function (subject) {
        var num = +subject,
          val = 0;

        if (!Number.isNaN(num)) {
          val = _.clamp(num, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        }

        return val;
      },

      hideMethod: function (thisArg, name) {
        if (thisArg[name]) {
          _.setVariable(thisArg, name, undefined);
        }
      },

      isCircular: function (thisArg, stack, value) {
        if (stack.has(thisArg) || stack.has(value)) {
          throw new TypeError('circular object');
        }

        return false;
      }
    };

  /*
   * define iterators
   */

  /*
   * toArray
   */

  function toArray(mapFn, thisArg) {
    var result,
      item;

    _.mustBeAfunction(mapFn, 'mapFn');
    result = [];
    /*jshint validthis:true */
    for (item of this) {
      result.push(mapFn ? mapFn.call(thisArg, this, item) : item);
    }

    return result;
  }

  /*
   * unique
   */

  function* UniqueGenerator(thisArg) {
    var seen = new Set(),
      item,
      value;

    for (item of thisArg) {
      value = item;
      if (!seen.has(value)) {
        seen.add(value, true);
        yield item;
      }
    }
  }

  function unique() {
    /*jshint validthis:true */
    return new UniqueGenerator(this);
  }

  /*
   * flatten
   */

  function* FlattenGenerator(thisArg, relaxed) {
    var stack = new Map(),
      object,
      value,
      tail;

    for (object of thisArg) {
      if (_.isArray(object, relaxed)) {
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
          if (_.isArray(value, relaxed)) {
            _.isCircular(thisArg, stack, value);
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

  function flatten(relaxed) {
    /*jshint validthis:true */
    return new FlattenGenerator(this, relaxed);
  }

  /*
   * walkOwn
   */

  function* WalkOwnGenerator() {
    var stack = new Map(),
      object,
      value,
      tail,
      key;

    for (object of this) {
      if (_.isObject(object)) {
        stack.set(object, {
          keys: Object.keys(object),
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
          if (_.isObject(value)) {
            _.isCircular(this, stack, value);
            stack.set(value, {
              keys: Object.keys(value),
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

  function reverse() {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'reverse');
    _.hideMethod(this, 'reverse');
    _.setVariable(this, $.SYMBOL.REVERSED, true);

    return this;
  }

  function entries() {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'entries');
    _.hideMethod(this, 'entries');
    _.hideMethod(this, 'values');
    _.hideMethod(this, 'keys');
    this[$.SYMBOL.ENTRIES] = true;
    this[$.SYMBOL.KEYS] = false;
    this[$.SYMBOL.VALUES] = false;

    return this;
  }

  function values() {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'values');
    _.hideMethod(this, 'entries');
    _.hideMethod(this, 'values');
    _.hideMethod(this, 'keys');
    this[$.SYMBOL.ENTRIES] = false;
    this[$.SYMBOL.KEYS] = false;
    this[$.SYMBOL.VALUES] = true;

    return this;
  }

  function keys() {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'values');
    _.hideMethod(this, 'entries');
    _.hideMethod(this, 'values');
    _.hideMethod(this, 'keys');
    this[$.SYMBOL.ENTRIES] = false;
    this[$.SYMBOL.KEYS] = true;
    this[$.SYMBOL.VALUES] = false;

    return this;
  }

  /*
   * iterator execution
   */

  function getYieldValue(thisArg, object, key) {
    var result,
      value;

    if (thisArg[$.SYMBOL.KEYS]) {
      result = key;
    } else {
      value = object[key];
      if (thisArg[$.SYMBOL.VALUES]) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function* MapGenerator(subject, callback, thisArg) {
    for (var element of subject) {
      yield callback.call(thisArg, element, subject);
    }
  }

  function map(callback, thisArg) {
    /*jshint validthis:true */
    return new MapGenerator(this, _.checkcallback(callback), thisArg);
  }

  /*
   * filter
   */

  function* FilterGenerator(subject, callback, thisArg) {
    for (var element of subject) {
      if (callback.call(thisArg, element, subject)) {
        yield element;
      }
    }
  }

  function filter(callback, thisArg) {
    /*jshint validthis:true */
    return new FilterGenerator(this, _.checkcallback(callback), thisArg);
  }

  function then(Generator) {
    /*jshint validthis:true */
    var iterator;

    if (!_.isFunction(Generator)) {
      if (!_.isUndefined(Generator)) {
        throw new TypeError('If not undefined, Generator must be a function');
      }

      iterator = this;
    } else {
      iterator = new Generator(this);
      _.setMethod(iterator, 'keys', keys);
      _.setMethod(iterator, 'values', values);
      _.setMethod(iterator, 'entries', entries);
      _.setMethod(iterator, 'reverse', reverse);
      _.setMethod(iterator, 'filter', filter);
      _.setMethod(iterator, 'map', map);
      _.setMethod(iterator, 'unique', unique);
      _.setMethod(iterator, 'iterate', iterate);
      _.setMethod(iterator, 'enumerate', enumerate);
      _.setMethod(iterator, 'then', then);
      _.setMethod(iterator, 'toArray', toArray);
      _.setMethod(iterator, 'stringify', stringify);
      _.setMethod(iterator, 'flatten', flatten);
    }

    return iterator;
  }

  /*
   * counter
   */

  function setFrom(number) {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'from');
    _.hideMethod(this, 'from');
    _.setVariable(this, $.SYMBOL.FROM, _.toValidCount(number));

    return this;
  }

  function setTo(number) {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'to');
    _.hideMethod(this, 'to');
    _.setVariable(this, $.SYMBOL.TO, _.toValidCount(number));

    return this;
  }

  function setBy(number) {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'by');
    _.hideMethod(this, 'by');
    _.setVariable(this, $.SYMBOL.BY, Math.abs(_.toValidCount(number)));
    if (!this[$.SYMBOL.BY]) {
      throw new TypeError('can not count by zero');
    }

    return this;
  }

  function* CountReverseGenerator(thisArg) {
    var count = thisArg[$.SYMBOL.TO];

    if (thisArg[$.SYMBOL.TO] <= thisArg[$.SYMBOL.FROM]) {
      while (count <= thisArg[$.SYMBOL.FROM]) {
        yield count;
        count += thisArg[$.SYMBOL.BY];
      }
    } else {
      while (count >= thisArg[$.SYMBOL.FROM]) {
        yield count;
        count -= thisArg[$.SYMBOL.BY];
      }
    }
  }

  function* CountForwardGenerator(thisArg) {
    var count = thisArg[$.SYMBOL.FROM];

    if (thisArg[$.SYMBOL.FROM] <= thisArg[$.SYMBOL.TO]) {
      while (count <= thisArg[$.SYMBOL.TO]) {
        yield count;
        count += thisArg[$.SYMBOL.BY];
      }
    } else {
      while (count >= thisArg[$.SYMBOL.TO]) {
        yield count;
        count -= thisArg[$.SYMBOL.BY];
      }
    }
  }

  function* CountGenerator() {
    var from,
      to,
      by;

    _.setVariable(this, $.SYMBOL.STARTED, true);
    if (_.isUndefined(this[$.SYMBOL.FROM])) {
      from = 0;
    } else {
      from = this[$.SYMBOL.FROM];
    }

    _.setVariable(this, $.SYMBOL.FROM, from);
    if (_.isUndefined(this[$.SYMBOL.TO])) {
      to = Number.MAX_SAFE_INTEGER;
    } else {
      to = this[$.SYMBOL.TO];
    }

    _.setVariable(this, $.SYMBOL.TO, to);
    if (_.isUndefined(this[$.SYMBOL.BY])) {
      by = 1;
    } else {
      by = this[$.SYMBOL.BY];
    }

    _.setVariable(this, $.SYMBOL.BY, by);
    if (this[$.SYMBOL.REVERSED]) {
      yield * new CountReverseGenerator(this);
    } else {
      yield * new CountForwardGenerator(this);
    }
  }

  function setReversed(thisArg, iterator) {
    if (thisArg[$.SYMBOL.REVERSED]) {
      iterator.reverse();
    }

    return iterator;
  }

  /*
   * arrayEntries
   */

  function* ArrayGenerator(subject, thisArg) {
    var useThis = arguments.length > 1 ? thisArg : this,
      counter = new CountGenerator(),
      countIt = setReversed(useThis, counter.to(_.lastIndex(subject))),
      key;

    useThis[$.SYMBOL.STARTED] = true;
    for (key of countIt) {
      yield getYieldValue(useThis, subject, key);
    }
  }

  /*
   * stringEntries
   */

  function stringify(mapFn, thisArg) {
    var result,
      item;

    _.mustBeAfunction(mapFn, 'mapFn');
    result = '';
    /*jshint validthis:true */
    for (item of this) {
      result += mapFn ? mapFn.call(thisArg, this, item) : item;
    }

    return result;
  }

  function getStringYieldValue(thisArg, character, key) {
    var value,
      result;

    if (thisArg[$.SYMBOL.KEYS]) {
      result = key;
    } else {
      value = String.fromCodePoint(character.codePointAt(0));
      if (thisArg[$.SYMBOL.VALUES]) {
        result = value;
      } else {
        result = [key, value];
      }
    }

    return result;
  }

  function* StringGenerator(subject, thisArg) {
    var useThis = arguments.length > 1 ? thisArg : this,
      counter = new CountGenerator(),
      countIt = setReversed(useThis, counter.to(_.lastIndex(subject))),
      next = true,
      char1,
      char2,
      key;

    useThis[$.SYMBOL.STARTED] = true;
    for (key of countIt) {
      if (next) {
        if (useThis[$.SYMBOL.REVERSED]) {
          char1 = subject[key - 1];
          char2 = subject[key];
          next = !_.isSurrogatePair(char1, char2);
          if (next) {
            yield getStringYieldValue(useThis, char2, key);
          }
        } else {
          char1 = subject[key];
          char2 = subject[key + 1];
          next = !_.isSurrogatePair(char1, char2);
          yield getStringYieldValue(useThis, char1 + char2, key);
        }
      } else {
        next = !next;
        if (useThis[$.SYMBOL.REVERSED]) {
          yield getStringYieldValue(useThis, char1 + char2, key);
        }
      }
    }
  }

  /*
   * enumerate
   */

  function setOwn() {
    /*jshint validthis:true */
    _.canNotBeChanged(this, 'own');
    _.hideMethod(this, 'own');
    _.setVariable(this, $.SYMBOL.OWN, true);

    return this;
  }

  function* ForInGenerator(thisArg, subject) {
    var key,
      own;

    if (_.isUndefined(thisArg[$.SYMBOL.OWN])) {
      own = false;
    } else {
      own = thisArg[$.SYMBOL.OWN];
    }

    for (key in subject) {
      if (!own || _.hasOwn(subject, key)) {
        yield getYieldValue(thisArg, subject, key);
      }
    }
  }

  function* EnumerateGenerator(subject) {
    var value;

    this[$.SYMBOL.STARTED] = true;
    if (_.isObject(subject) && _.isFunction(subject.next)) {
      for (value of subject) {
        yield * new ForInGenerator(this, value);
      }
    } else {
      yield * new ForInGenerator(this, subject);
    }
  }

  function enumerate() {
    /*jshint validthis:true */
    return new EnumerateGenerator(this);
  }

  function* MapObjectGenerator(subject, thisArg) {
    var useThis = arguments.length > 1 ? thisArg : this;

    if (useThis) {
      throw new Error('not yet');
    }

    yield undefined;
  }

  function* SetObjectGenerator(subject, thisArg) {
    var useThis = arguments.length > 1 ? thisArg : this;

    if (useThis) {
      throw new Error('not yet');
    }

    yield undefined;
  }

  function genetateCount(subject, to, by) {
    var iterator = new CountGenerator();

    if (_.isNumber(subject)) {
      if (_.isNil(to)) {
        iterator.to(subject);
      } else {
        iterator.from(subject).to(to);
      }

      if (!_.isNil(by)) {
        iterator.by(by);
      }
    }

    return iterator;
  }

  function generateOthers(subject) {
    var tag = _.toStringTag(subject),
      iterator;

    if (tag === $.MAPTAG) {
      iterator = new MapObjectGenerator(subject);
    } else if (tag === $.SETTAG) {
      iterator = new SetObjectGenerator(subject);
    } else {
      iterator = new EnumerateGenerator(subject);
    }

    return iterator;
  }

  function Reiterate(subject, to, by) {
    if (!(this instanceof Reiterate)) {
      return new Reiterate(subject, to, by);
    }

    var iterator;

    if (_.isNil(subject) || _.isNumber(subject)) {
      iterator = genetateCount(subject, to, by);
    } else if (_.isArray(subject, to)) {
      iterator = new ArrayGenerator(subject);
    } else if (_.isString(subject)) {
      iterator = new StringGenerator(subject);
    } else {
      iterator = generateOthers(subject);
    }

    return iterator;
  }

  function* IterateIterator(subject, relaxed) {
    var value,
      tag;

    this[$.SYMBOL.STARTED] = true;
    for (value of subject) {
      if (_.isArray(value, relaxed)) {
        yield * new ArrayGenerator(value, this);
      } else if (_.isString(value)) {
        yield * new StringGenerator(value, this);
      } else {
        tag = _.toStringTag(value);
        if (tag === $.MAPTAG) {
          yield * new MapObjectGenerator(value, this);
        } else if (tag === $.SETTAG) {
          yield * new SetObjectGenerator(value, this);
        }
      }
    }
  }

  function iterate(relaxed) {
    /*jshint validthis:true */
    return new IterateIterator(this, relaxed);
  }

  /*
   * reduce
   */

  /*
  _.setMethod(Reiterate, 'reduce', function (subject, callback, initialValue) {
    var object = _.requireObjectCoercible(subject),
      element,
      index;

    _.checkcallback(callback);
    index = 0;
    for (element of object) {
      initialValue = callback(initialValue, element, index, object);
      index += 1;
    }

    return initialValue;
  });
  */

  /*
   * forEach
   */

  /*
  _.setMethod(Reiterate, 'forEach', function (subject, callback, thisArg) {
    var object = _.requireObjectCoercible(subject),
      element,
      index;

    _.checkcallback(callback);
    index = 0;
    for (element of object) {
      callback.call(thisArg, element, index, object);
      index += 1;
    }
  });
  */

  /*
   * every
   */

  /*
  _.setMethod(Reiterate, 'every', function (subject, callback, thisArg) {
    var object = _.requireObjectCoercible(subject),
      result,
      element,
      index;

    _.checkcallback(callback);
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
  */

  _.setMethod(CountGenerator.prototype, 'from', setFrom);
  _.setMethod(CountGenerator.prototype, 'to', setTo);
  _.setMethod(CountGenerator.prototype, 'by', setBy);
  _.setMethod(CountGenerator.prototype, 'reverse', reverse);
  _.setMethod(CountGenerator.prototype, 'then', then);
  _.setMethod(CountGenerator.prototype, 'filter', filter);
  _.setMethod(CountGenerator.prototype, 'map', map);
  _.setMethod(CountGenerator.prototype, 'toArray', toArray);

  _.setMethod(MapGenerator.prototype, 'reverse', reverse);
  _.setMethod(MapGenerator.prototype, 'filter', filter);
  _.setMethod(MapGenerator.prototype, 'map', map);
  _.setMethod(MapGenerator.prototype, 'unique', unique);
  _.setMethod(MapGenerator.prototype, 'iterate', iterate);
  _.setMethod(MapGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(MapGenerator.prototype, 'then', then);
  _.setMethod(MapGenerator.prototype, 'toArray', toArray);
  _.setMethod(MapGenerator.prototype, 'flatten', flatten);

  _.setMethod(FilterGenerator.prototype, 'reverse', reverse);
  _.setMethod(FilterGenerator.prototype, 'filter', filter);
  _.setMethod(FilterGenerator.prototype, 'map', map);
  _.setMethod(FilterGenerator.prototype, 'unique', unique);
  _.setMethod(FilterGenerator.prototype, 'iterate', iterate);
  _.setMethod(FilterGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(FilterGenerator.prototype, 'then', then);
  _.setMethod(FilterGenerator.prototype, 'toArray', toArray);
  _.setMethod(FilterGenerator.prototype, 'flatten', flatten);

  _.setMethod(ArrayGenerator.prototype, 'keys', keys);
  _.setMethod(ArrayGenerator.prototype, 'values', values);
  _.setMethod(ArrayGenerator.prototype, 'entries', entries);
  _.setMethod(ArrayGenerator.prototype, 'reverse', reverse);
  _.setMethod(ArrayGenerator.prototype, 'filter', filter);
  _.setMethod(ArrayGenerator.prototype, 'map', map);
  _.setMethod(ArrayGenerator.prototype, 'unique', unique);
  _.setMethod(ArrayGenerator.prototype, 'iterate', iterate);
  _.setMethod(ArrayGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(ArrayGenerator.prototype, 'then', then);
  _.setMethod(ArrayGenerator.prototype, 'toArray', toArray);
  _.setMethod(ArrayGenerator.prototype, 'flatten', flatten);

  _.setMethod(IterateIterator.prototype, 'keys', keys);
  _.setMethod(IterateIterator.prototype, 'values', values);
  _.setMethod(IterateIterator.prototype, 'entries', entries);
  _.setMethod(IterateIterator.prototype, 'reverse', reverse);
  _.setMethod(IterateIterator.prototype, 'filter', filter);
  _.setMethod(IterateIterator.prototype, 'map', map);
  _.setMethod(IterateIterator.prototype, 'unique', unique);
  _.setMethod(IterateIterator.prototype, 'iterate', iterate);
  _.setMethod(IterateIterator.prototype, 'enumerate', enumerate);
  _.setMethod(IterateIterator.prototype, 'then', then);
  _.setMethod(IterateIterator.prototype, 'toArray', toArray);
  _.setMethod(IterateIterator.prototype, 'flatten', flatten);

  _.setMethod(StringGenerator.prototype, 'keys', keys);
  _.setMethod(StringGenerator.prototype, 'values', values);
  _.setMethod(StringGenerator.prototype, 'entries', entries);
  _.setMethod(StringGenerator.prototype, 'reverse', reverse);
  _.setMethod(StringGenerator.prototype, 'filter', filter);
  _.setMethod(StringGenerator.prototype, 'map', map);
  _.setMethod(StringGenerator.prototype, 'unique', unique);
  _.setMethod(StringGenerator.prototype, 'iterate', iterate);
  _.setMethod(StringGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(StringGenerator.prototype, 'then', then);
  _.setMethod(StringGenerator.prototype, 'toArray', toArray);
  _.setMethod(StringGenerator.prototype, 'stringify', stringify);

  _.setMethod(EnumerateGenerator.prototype, 'keys', keys);
  _.setMethod(EnumerateGenerator.prototype, 'values', values);
  _.setMethod(EnumerateGenerator.prototype, 'entries', entries);
  _.setMethod(EnumerateGenerator.prototype, 'unique', unique);
  _.setMethod(EnumerateGenerator.prototype, 'filter', filter);
  _.setMethod(EnumerateGenerator.prototype, 'map', map);
  _.setMethod(EnumerateGenerator.prototype, 'iterate', iterate);
  _.setMethod(EnumerateGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(EnumerateGenerator.prototype, 'own', setOwn);
  _.setMethod(EnumerateGenerator.prototype, 'then', then);
  _.setMethod(EnumerateGenerator.prototype, 'toArray', toArray);
  _.setMethod(EnumerateGenerator.prototype, 'flatten', flatten);

  _.setMethod(UniqueGenerator.prototype, 'filter', filter);
  _.setMethod(UniqueGenerator.prototype, 'map', map);
  _.setMethod(UniqueGenerator.prototype, 'unique', unique);
  _.setMethod(UniqueGenerator.prototype, 'iterate', iterate);
  _.setMethod(UniqueGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(UniqueGenerator.prototype, 'then', then);
  _.setMethod(UniqueGenerator.prototype, 'toArray', toArray);
  _.setMethod(UniqueGenerator.prototype, 'flatten', flatten);

  _.setMethod(FlattenGenerator.prototype, 'filter', filter);
  _.setMethod(FlattenGenerator.prototype, 'map', map);
  _.setMethod(FlattenGenerator.prototype, 'unique', unique);
  _.setMethod(FlattenGenerator.prototype, 'iterate', iterate);
  _.setMethod(FlattenGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(FlattenGenerator.prototype, 'then', then);
  _.setMethod(FlattenGenerator.prototype, 'toArray', toArray);
  _.setMethod(FlattenGenerator.prototype, 'flatten', flatten);

  _.setMethod(WalkOwnGenerator.prototype, 'filter', filter);
  _.setMethod(WalkOwnGenerator.prototype, 'map', map);
  _.setMethod(WalkOwnGenerator.prototype, 'unique', unique);
  _.setMethod(WalkOwnGenerator.prototype, 'iterate', iterate);
  _.setMethod(WalkOwnGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(WalkOwnGenerator.prototype, 'then', then);
  _.setMethod(WalkOwnGenerator.prototype, 'toArray', toArray);
  _.setMethod(WalkOwnGenerator.prototype, 'flatten', flatten);

  _.setMethod(MapObjectGenerator.prototype, 'filter', filter);
  _.setMethod(MapObjectGenerator.prototype, 'map', map);
  _.setMethod(MapObjectGenerator.prototype, 'unique', unique);
  _.setMethod(MapObjectGenerator.prototype, 'iterate', iterate);
  _.setMethod(MapObjectGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(MapObjectGenerator.prototype, 'then', then);
  _.setMethod(MapObjectGenerator.prototype, 'toArray', toArray);
  _.setMethod(MapObjectGenerator.prototype, 'flatten', flatten);

  _.setMethod(SetObjectGenerator.prototype, 'filter', filter);
  _.setMethod(SetObjectGenerator.prototype, 'map', map);
  _.setMethod(SetObjectGenerator.prototype, 'iterate', iterate);
  _.setMethod(SetObjectGenerator.prototype, 'enumerate', enumerate);
  _.setMethod(SetObjectGenerator.prototype, 'then', then);
  _.setMethod(SetObjectGenerator.prototype, 'toArray', toArray);
  _.setMethod(SetObjectGenerator.prototype, 'flatten', flatten);

  return Reiterate;
}));
