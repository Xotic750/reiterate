/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, es3:true, plusplus:true, maxparams:3, maxdepth:3,
    maxstatements:25, maxcomplexity:10
*/
/*global module, require, process */
/* istanbul ignore next */
(function () {
  'use strict';

  module.exports.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  module.exports.MIN_SAFE_INTEGER = -module.exports.MAX_SAFE_INTEGER;
  module.exports.expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/@@MODULE.min');
  } else {
    module.exports.subject = require('../lib/@@MODULE');
  }

  module.exports.isGeneratorSupported = (function () {
    try {
      /*jslint evil:true */
      eval('(function*(){})()');
      return true;
    } catch (ignore) {}

    return false;
  }());

  module.exports.isNativeSymbolIterator = typeof module.exports.iterator ===
    'symbol';

  module.exports.forOf = (function () {
    var val,
      fn;

    if (!module.exports.subject.useShims &&
      module.exports.isNativeSymbolIterator) {
      try {
        /*jshint evil:true */
        fn = new Function('return function(iterable,callback,thisArg){for(' +
          'var item of iterable)if(callback.call(thisArg,item))break};')();

        val = 1;
        fn([1, 2, 3], function (entry) {
          if (entry !== val) {
            throw new Error();
          }

          val += 1;
        });

        if (val !== 4) {
          throw new Error();
        }

        val = 1;
        fn('123', function (entry) {
          if (entry !== String(val)) {
            throw new Error();
          }

          val += 1;
        });

        if (val !== 4) {
          throw new Error();
        }

        module.exports.isForOfSupported = true;
      } catch (e) {
        fn = module.exports.isForOfSupported = false;
      }
    }

    if (!fn) {
      fn = function (iterable, callback, thisArg) {
        var generator = iterable[module.exports.subject.iterator],
          iterator = generator(),
          next = iterator.next();

        while (!next.done && !callback.call(thisArg, next.value)) {
          next = iterator.next();
        }
      };
    }

    return fn;
  }());
}());
