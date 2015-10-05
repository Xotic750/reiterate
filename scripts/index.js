/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:3, maxstatements:25,
    maxcomplexity:10
*/
/*global module, require, process */

(function () {
  'use strict';

  module.exports.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  module.exports.MIN_SAFE_INTEGER = -module.exports.MAX_SAFE_INTEGER;
  module.exports.expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/reiterate.min');
  } else {
    module.exports.subject = require('../lib/reiterate');
  }

  module.exports.codePointAt = function (subject, position) {
    /*jshint eqnull:true */
    if (subject == null) {
      throw new TypeError('null or undefined');
    }

    var string = String(subject),
      size = string.length,
      /*jshint bitwise:false */
      index = position >> 0,
      first,
      second,
      val;

    if (index >= 0 && index < size) {
      first = string.charCodeAt(index);
      if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
        second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
          val = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
      }
    }

    return val || first;
  };

  module.exports.isGeneratorSupported = (function () {
    try {
      /*jslint evil:true */
      eval('(function*(){})()');
      return true;
    } catch (ignore) {}

    return false;
  }());

  module.exports.isForOfSupported = (function () {
    try {
      /*jslint evil:true */
      eval("for (var e of ['a']) {}");
      return true;
    } catch (ignore) {}

    return false;
  }());

  module.exports.iterator = typeof Symbol === 'function' ?
    Symbol.iterator :
    '@@iterator';

  module.exports.forOf = (function () {
    var fn;

    if (module.exports.isForOfSupported) {
      /*jshint evil:true */
      fn = new Function('return function(iterable,callback,thisArg){for(var ' +
        'item of iterable)if(callback.call(thisArg,item))' +
        'break};')();
    } else {
      fn = function (iterable, callback, thisArg) {
        var generator = iterable[module.exports.iterator],
          iterator = generator(),
          next = iterator.next();

        while (!next.done && !callback.call(thisArg, next.value)) {
          next = iterator.next();
        }
      };
    }

    return fn;
  }());

  module.exports.reduce = (function () {
    var msg = 'reduce of empty array with no initial value';

    return function (array, callback, initialValue) {
      var object,
        acc,
        length,
        kPresent,
        index;

      /*jslint eqnull:true */
      if (array == null) {
        throw new TypeError('null or undefined');
      }

      if (Object.prototype.toString.call(callback) !== '[object Function]') {
        throw new TypeError('must be a function');
      }

      object = Object(array);
      /*jshint bitwise:false */
      length = object.length >>> 0;
      if (!length && arguments.length === 1) {
        throw new TypeError(msg);
      }

      index = 0;
      if (arguments.length > 1) {
        acc = initialValue;
      } else {
        kPresent = false;
        while (!kPresent && index < length) {
          kPresent = index in object;
          if (kPresent) {
            acc = object[index];
            index += 1;
          }
        }

        if (!kPresent) {
          throw new TypeError(msg);
        }
      }

      while (index < length) {
        if (index in object) {
          acc = callback.call(
            undefined,
            acc,
            object[index],
            index,
            object
          );
        }

        index += 1;
      }

      return acc;
    };
  }());

  module.exports.forEach = function (array, callback, thisArg) {
    var object,
      length,
      index;

    /*jslint eqnull:true */
    if (array == null) {
      throw new TypeError('null or undefined');
    }

    if (Object.prototype.toString.call(callback) !== '[object Function]') {
      throw new TypeError('must be a function');
    }

    object = Object(array);
    /*jshint bitwise:false */
    length = object.length >>> 0;
    index = 0;
    while (index < length) {
      if (index in object) {
        callback.call(thisArg, object[index], index, object);
      }

      index += 1;
    }
  };

  module.exports.map = function (array, callback, thisArg) {
    var object,
      length,
      arr,
      index;

    /*jslint eqnull:true */
    if (array == null) {
      throw new TypeError('null or undefined');
    }

    if (Object.prototype.toString.call(callback) !== '[object Function]') {
      throw new TypeError('must be a function');
    }

    object = Object(array);
    arr = [];
    /*jshint bitwise:false */
    arr.length = length = object.length >>> 0;
    index = 0;
    while (index < length) {
      if (index in object) {
        arr[index] = callback.call(
          thisArg,
          object[index],
          index,
          object
        );
      }

      index += 1;
    }

    return arr;
  };
}());
