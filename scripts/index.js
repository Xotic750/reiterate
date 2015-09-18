/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:20,
    maxcomplexity:6
*/
/*global module, require, process */

(function () {
  'use strict';

  module.exports = {
    expect: require('expect.js'),
    subject: require('../lib/' + process.env.TEST_NAME)
  };
}());
