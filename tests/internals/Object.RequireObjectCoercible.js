/*jshint
    bitwise:true, camelcase:true, curly:true, eqeqeq:true, forin:true,
    freeze:true, futurehostile:true, latedef:true, newcap:true, nocomma:true,
    nonbsp:true, singleGroups:true, strict:true, undef:true, unused:true,
    esnext:false, plusplus:true, maxparams:false, maxdepth:false,
    maxstatements:false, maxcomplexity:false
*/
/*global require, describe, it */

(function () {
  'use strict';

  var required = require('../../scripts/'),
    reiterate = required.subject,
    expect = required.expect;

  describe('Object.reiterate.$.requireObjectCoercible', function () {
    it('should not throw an error in each case', function () {
      expect(function () {
        reiterate.$.requireObjectCoercible();
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(undefined);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(null);
      }).to.throwException(function (e) {
        expect(e).to.be.a(TypeError);
      });

      expect(function () {
        reiterate.$.requireObjectCoercible(-1);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(0);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(1);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(NaN);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(Infinity);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(-Infinity);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(true);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(false);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible('');
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible('x');
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(reiterate.$.noop);
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(new RegExp('y'));
      }).to.not.throwException();

      expect(function () {
        reiterate.$.requireObjectCoercible(new Date());
      }).to.not.throwException();
    });
  });
}());
