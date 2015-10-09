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

  describe('Function.isFunction', function () {
    it('non functions should be not ok in each case', function () {
      expect(reiterate.$.isFunction()).to.not.be.ok();
      expect(reiterate.$.isFunction(undefined)).to.not.be.ok();
      expect(reiterate.$.isFunction(null)).to.not.be.ok();
      expect(reiterate.$.isFunction(1)).to.not.be.ok();
      expect(reiterate.$.isFunction(true)).to.not.be.ok();
      expect(reiterate.$.isFunction('')).to.not.be.ok();
      expect(reiterate.$.isFunction(new Error('x'))).to.not.be.ok();
      expect(reiterate.$.isFunction(new Date())).to.not.be.ok();
      expect(reiterate.$.isFunction(new RegExp('x'))).to.not.be.ok();
      expect(reiterate.$.isFunction([])).to.not.be.ok();
      expect(reiterate.$.isFunction({})).to.not.be.ok();
      expect(reiterate.$.isFunction(reiterate.$.returnArgs())).to.not.be.ok();
      expect(reiterate.$.isFunction(Function.prototype)).to.be.ok();
    });

    it('user functions should not ok in each case', function () {
      expect(reiterate.$.isFunction(reiterate.$.noop)).to.be.ok();
      expect(reiterate.$.isFunction(describe)).to.be.ok();
      expect(reiterate.$.isFunction(expect)).to.be.ok();
      expect(reiterate.$.isFunction(it)).to.be.ok();
    });

    it('Error constructor should be ok', function () {
      expect(reiterate.$.isFunction(Error)).to.be.ok();
    });

    it('Date constructor should be ok', function () {
      expect(reiterate.$.isFunction(Date)).to.be.ok();
    });

    it('RegExp constructor should be ok', function () {
      expect(reiterate.$.isFunction(RegExp)).to.be.ok();
    });

    it('Function constructor should be ok', function () {
      expect(reiterate.$.isFunction(Function)).to.be.ok();
    });

    it('Boolean constructor should be ok', function () {
      expect(reiterate.$.isFunction(Boolean)).to.be.ok();
    });

    it('Number constructor should be ok', function () {
      expect(reiterate.$.isFunction(Number)).to.be.ok();
    });

    it('String constructor should be ok', function () {
      expect(reiterate.$.isFunction(String)).to.be.ok();
    });

    it('Object constructor should be ok', function () {
      expect(reiterate.$.isFunction(Object)).to.be.ok();
    });

    it('isNaN should be ok', function () {
      expect(reiterate.$.isFunction(isNaN)).to.be.ok();
    });

    it('isFinite should be ok', function () {
      expect(reiterate.$.isFunction(isFinite)).to.be.ok();
    });
  });
}());
