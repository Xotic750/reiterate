/*jslint maxlen:80, es6:true, this:true */
/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:true, plusplus:true, maxparams:3, maxdepth:4, maxstatements:200,
    maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../scripts/'),
    expect = required.expect,
    reiterate = required.subject;

  describe('Basic tests', function () {
    it('Initialise', function () {
      expect(function () {
        reiterate();
      }).to.not.throwException();

      expect(function () {
        reiterate(undefined);
      }).to.not.throwException();

      expect(function () {
        reiterate(null);
      }).to.not.throwException();

      expect(function () {
        reiterate(0);
      }).to.not.throwException();

      expect(function () {
        reiterate(false);
      }).to.not.throwException();

      expect(function () {
        reiterate('');
      }).to.not.throwException();

      expect(function () {
        reiterate([]);
      }).to.not.throwException();

      expect(function () {
        reiterate({});
      }).to.not.throwException();
    });
  });
}());