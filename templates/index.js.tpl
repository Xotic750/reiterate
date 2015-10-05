/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:7,
    maxcomplexity:2
*/
/*global module, require, process */

(function () {
  'use strict';

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

  module.exports.isForOfSupported = (function () {
    try {
      /*jslint evil:true */
      eval("for (var e of ['a']) {}");
      return true;
    } catch (ignore) {}

    return false;
  }());
}());
