/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, es3:true, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global window, self, global, module, require, process */
/* istanbul ignore next */
(function (context) {
  'use strict';

  module.exports.global = context;

  function toStringTag(subject) {
    return Object.prototype.toString.call(subject);
  }

  module.exports.toStringTag = toStringTag;

  module.exports.isStrictMode = function isStrictMode() {
    return (function () {
      return !this;
    }());
  };

  module.exports.expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/reiterate.min');
  } else {
    module.exports.subject = require('../lib/reiterate');
  }

  var $ = module.exports.subject.$;

  module.exports.isGeneratorSupported = (function () {
    try {
      /*jshint evil:true */
      eval('(function*(){})()');
      return true;
    } catch (e) {
      return !e;
    }
  }());

  module.exports.isNativeSymbolIterator = $.isSymbol($.symIt);

  module.exports.forOf = (function () {
    var val,
      fn;

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
      fn = module.exports.isForOfSupported = !e;
    }

    if (!fn) {
      fn = function (iterable, callback, thisArg) {
        var generator = iterable[$.symIt],
          iterator = generator(),
          next = iterator.next();

        while (!next.done && !callback.call(thisArg, next.value)) {
          next = iterator.next();
        }
      };
    }

    return fn;
  }());

  module.exports.create = function (varArgs) {
    var length = arguments.length,
      result = [],
      sliced,
      idx,
      it;

    if (!length) {
      result.length = 0;
    } else if (length === 1) {
      if ($.isNumber(varArgs)) {
        result.length = varArgs;
      } else if ($.isString(varArgs)) {
        sliced = varArgs.slice(1, -1).replace(/^\s+|\s+$/g, '');
        if (sliced[sliced.length - 1] === ',') {
          sliced = sliced.slice(0, -1);
        }

        sliced = sliced.split(',');
        length = sliced.length;
        for (idx = 0; idx < length; idx += 1) {
          it = sliced[idx].replace(/^\s+|\s+$/g, '');
          if (it) {
            /*jshint evil: true */
            result[idx] = eval(it);
            if (idx + 1 > result.length) {
              result.length = idx + 1;
            }
          }
        }
      } else {
        result[0] = varArgs;
        result.length = 1;
      }
    } else {
      for (idx = 0; idx < length; idx += 1) {
        result[idx] = arguments[idx];
        if (idx + 1 > result.length) {
          result.length = idx + 1;
        }
      }
    }

    return result;
  };

  module.exports.array2Object = function array2Object(array) {
    var object = $.toObject(array),
      accumulator = {},
      length,
      index;

    if (!$.isFunction(object)) {
      accumulator.length = length = $.toLength(object.length);
      for (index = 0; index < length; index += 1) {
        if (index in object) {
          accumulator[index] = object[index];
        }
      }
    } else {
      accumulator.length = 0;
    }

    return accumulator;
  };

}(
  /*jshint singleGroups:false */
  ((typeof window === 'function' || typeof window === 'object') && window) ||
  (typeof self === 'object' && self) ||
  (typeof global === 'object' && global) ||
  (typeof this === 'object' && this) || {}
));
