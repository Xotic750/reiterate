/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:1, maxdepth:2, maxstatements:100,
    maxcomplexity:false
*/
/*global module, require */

(function () {
  'use strict';

  module.exports. expect = require('expect.js');
  if (process.env.MIN) {
    module.exports.subject = require('../lib/reiterate.min');
  } else {
    module.exports.subject = require('../lib/reiterate');
  }
}());
